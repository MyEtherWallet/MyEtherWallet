import { ref } from 'vue';
import { LendingPool, ChainId } from '@aave/contract-helpers';
import BigNumber from 'bignumber.js';
import { formatReserves, formatUserSummary } from '@aave/math-utils';
import { toBN, toHex } from 'web3-utils';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';

import {
  ReserveUpdateSubscription,
  UserPositionUpdateSubscription,
  UsdPriceEth
} from '@/dapps/aave-dapp/apollo/graphql/subscriptions';
import {
  Toast,
  SUCCESS,
  ERROR,
  WARNING
} from '@/modules/toast/handler/handlerToast';
import configs from '@/dapps/aave-dapp/apollo/configs';
import eth from '@/assets/images/currencies/eth.png';
import { ethers } from 'ethers';
import { INTEREST_TYPES } from '../handlers/helpers';
import { estimateGasList } from '@/core/helpers/gasPriceHelper';
import { ABI } from './ABI';
import handleError from '@/modules/confirmation/handlers/errorHandler';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

const LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const REPAY_WITH_COLLATERAL_ADAPTER =
  '0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6';
const SWAP_COLLATERAL_ADAPTER = '0x135896DE8421be2ec868E0b811006171D9df802A';
const WETH_GATEWAY = '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04';
const PRICE_ORACLE = '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9';

export const useAaveDapp = () => {
  // injections/use
  const { address, web3, tokensList, balanceInWei } = useWalletStore();
  const { gasPriceType, getFiatValue, gasPriceByType, network } =
    useGlobalStore();
  const { contractToToken } = useExternalStore();

  // data
  const reservsStable = ref([]);
  const reservesData = ref([]);
  const rawReserveData = ref([]);
  const userReserveData = ref([]);
  const usdPriceEth = ref('');
  const userSummary = ref({});
  const poolContract = ref({});
  const priceOracle = ref({});

  const provider = new ethers.providers.StaticJsonRpcProvider(
    'https://nodes.mewapi.io/rpc/eth',
    ChainId.mainnet
  );

  const lendingPool = new LendingPool(provider, {
    LENDING_POOL: LENDING_POOL,
    REPAY_WITH_COLLATERAL_ADAPTER: REPAY_WITH_COLLATERAL_ADAPTER,
    SWAP_COLLATERAL_ADAPTER: SWAP_COLLATERAL_ADAPTER,
    WETH_GATEWAY: WETH_GATEWAY
  });

  poolContract.value = lendingPool.getContractInstance(LENDING_POOL);
  priceOracle.value = new ethers.Contract(PRICE_ORACLE, ABI, provider);

  /**
   * Apollo mutation to repay funds
   *  @param {object} data
   * @param {String} data.user - The ethereum address that repays
   * @param {String} data.reserve - The ethereum address of the reserve on which the user borrowed
   * @param {String|Number} data.amount - The amount to repay, or (-1) if the user wants to repay everything
   * @param data.interestRateMode -  // Whether stable (InterestRate.Stable) or variable (InterestRate.Variable) debt will be repaid
   */
  const onRepay = async ({ amount, reserve, interestRateMode, user }) => {
    try {
      let txs = [];
      const allowance = await formatAllowanceData(
        reserve,
        user,
        poolContract.value.address
      );

      const approveData = await formatApprovalData(
        reserve,
        user,
        poolContract.value.address,
        amount
      );

      const resetApproveData = await formatApprovalData(
        reserve,
        user,
        poolContract.value.address,
        0
      );
      const data = await poolContract.value.populateTransaction.repay(
        reserve,
        amount,
        interestRateMode === INTEREST_TYPES.variable ? 2 : 1,
        user
      );
      data.from = user;

      if (toBN(allowance).gt(toBN(amount))) {
        txs = [data];
      } else {
        txs = [resetApproveData, approveData, data];
      }
      const gasLimits = await estimateGasList(network.type.name, txs);
      sendTxns(txs, gasLimits);
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   * Apollo mutation to borrow funds
   */
  const onBorrow = async ({
    amount,
    reserve,
    referralCode,
    interestRateMode,
    user
  }) => {
    try {
      const data = [
        reserve,
        amount,
        interestRateMode === INTEREST_TYPES.variable ? 2 : 1,
        referralCode,
        user
      ];
      const txData = await poolContract.value.populateTransaction.borrow(
        ...data
      );
      formatTxData(txData);
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   * Deposit funds
   */
  const onDeposit = async ({ amount, reserve, referralCode, user }) => {
    try {
      let txs = [];
      const allowance = await formatAllowanceData(
        reserve,
        user,
        poolContract.value.address
      );

      const resetApproveData = await formatApprovalData(
        reserve,
        user,
        poolContract.value.address,
        0
      );

      const approveData = await formatApprovalData(
        reserve,
        user,
        poolContract.value.address,
        amount
      );
      const txData = await poolContract.value.populateTransaction.deposit(
        reserve,
        amount,
        user,
        referralCode
      );
      txData.from = user;
      if (toBN(allowance).gt(toBN(amount))) {
        txs = [txData];
      } else {
        txs = [resetApproveData, approveData, txData];
      }
      const gasLimits = await estimateGasList(network.type.name, txs);
      sendTxns(txs, gasLimits);
    } catch (e) {
      throw new Error(e);
    }
  };

  const onWithdraw = async ({ reserve, amount, user }) => {
    try {
      //  If user has any existing debt backed by the underlying token,
      //  then the max amount available to withdraw is the amount that
      //  will not leave user health factor < 1 after withdrawal.
      const txData = await poolContract.value.populateTransaction.withdraw(
        reserve,
        amount,
        user
      );
      formatTxData(txData);
    } catch (e) {
      throw new Error(e);
    }
  };
  /**
   * format transaction data for token approval
   *
   * @param tokenAddress The ethereum address of the token needing approval
   * @param user The ethereum address that owns the asset
   * @param spender The ethereum address that will spend the asset
   * @param amount The amount of asset that will be approved
   */
  const formatApprovalData = async (tokenAddress, user, spender, amount) => {
    try {
      const ABI = [
        'function approve(address _spender, uint256 _value) public returns (bool success)'
      ];
      const token = new ethers.Contract(
        tokenAddress,
        ABI,
        poolContract.value.provider
      );
      const approveData = await token.populateTransaction.approve(
        spender,
        amount
      );
      approveData.from = user;
      return approveData;
    } catch (e) {
      throw new Error(e);
    }
  };
  /**
   * Check and prepare data to send tx
   * or errors out
   */
  const formatTxData = (txData, callback) => {
    try {
      const tx = {
        from: address,
        to: txData.to,
        data: txData.data,
        value: '0',
        gasPrice: gasPriceByType(gasPriceType)
      };
      web3.eth
        .estimateGas(tx)
        .then(res => {
          tx['gas'] = toHex(res);
          web3.eth
            .sendTransaction(tx)
            .then(res => {
              if (res?.rejected) {
                Toast('User rejected action!', {}, WARNING);
              }
              Toast(
                'Success! Your transaction will be displayed shortly',
                {},
                SUCCESS
              );
            })
            .catch(err => {
              const error = handleError(err);
              if (error) Toast(err, {}, ERROR);
              if (callback) callback[0](callback[1]);
            });
        }) // Estimate Gas Catch
        .catch(() => {
          Toast('Insufficient funds for gas', {}, ERROR);
          if (callback) callback[0](callback[1]);
        });
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  };

  /**
   * format transaction data for token allowance
   *
   * @param tokenAddress The ethereum address of the token needing approval
   * @param user The ethereum address that owns the asset
   * @param spender The ethereum address that will spend the asset
   */
  const formatAllowanceData = async (tokenAddress, user, spender) => {
    try {
      const ABI = [
        {
          constant: true,
          inputs: [
            { name: '_owner', type: 'address' },
            { name: '_spender', type: 'address' }
          ],
          name: 'allowance',
          outputs: [{ name: 'remaining', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      ];
      const token = new web3.eth.Contract(ABI, tokenAddress);
      return token.methods.allowance(user, spender).call();
    } catch (e) {
      throw new Error(e);
    }
  };

  /**
   * Check and prepare data to send multiple txns
   * or errors out
   */
  const sendTxns = (txns, gasLimits) => {
    try {
      if (!gasLimits) throw new Error('Unable to estimate transaction fees');
      for (let i = 0; i < txns.length; i++) {
        const tx = {
          from: address,
          to: txns[i].to,
          data: txns[i].data,
          gas: gasLimits[i],
          value: '0',
          gasPrice: gasPriceByType(gasPriceType)
        };
        txns[i] = tx;
      }
      let totalGasPrice = toBN(0);
      for (const tx of txns) {
        totalGasPrice = totalGasPrice.add(toBN(tx.gasPrice).mul(toBN(tx.gas)));
      }
      if (totalGasPrice.gt(toBN(balanceInWei))) {
        Toast('Insufficient funds for gas', {}, ERROR);
        return;
      }
      web3.mew
        .sendBatchTransactions(txns)
        .then(res => {
          if (res?.rejected) {
            Toast('User rejected action!', {}, WARNING);
          }
          Toast(
            'Success! Your transaction will be displayed shortly',
            {},
            SUCCESS
          );
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    } catch (e) {
      Toast(e, {}, ERROR);
    }
  };

  return {
    onWithdraw,
    onDeposit,
    onBorrow,
    onRepay,
    STABLE_COINS,
    LENDING_POOL,
    REPAY_WITH_COLLATERAL_ADAPTER,
    SWAP_COLLATERAL_ADAPTER,
    WETH_GATEWAY,
    PRICE_ORACLE
  };
};
