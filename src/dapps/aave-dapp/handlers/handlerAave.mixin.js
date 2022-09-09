/**
 * The Aave Apollo Mixin
 */
import { LendingPool, ChainId } from '@aave/contract-helpers';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { formatReserves, formatUserSummary } from '@aave/math-utils';
import { toBN, toHex } from 'web3-utils';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';

import {
  ReserveUpdateSubscription,
  UserPositionUpdateSubscription,
  UsdPriceEth
} from '@/dapps/aave-dapp/apollo/graphql/subscriptions';
import { Toast, SUCCESS, ERROR } from '@/modules/toast/handler/handlerToast';
import configs from '@/dapps/aave-dapp/apollo/configs';
import eth from '@/assets/images/currencies/eth.png';
import { ethers } from 'ethers';
import { INTEREST_TYPES } from '../handlers/helpers';
import { estimateGasList } from '@/core/helpers/gasPriceHelper';
import { ABI } from './ABI';

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

const LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const REPAY_WITH_COLLATERAL_ADAPTER =
  '0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6';
const SWAP_COLLATERAL_ADAPTER = '0x135896DE8421be2ec868E0b811006171D9df802A';
const WETH_GATEWAY = '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04';
const PRICE_ORACLE = '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9';

export default {
  name: 'handlerAave',
  props: {
    open: {
      default: false,
      type: Boolean
    },
    close: {
      default: () => {},
      type: Function
    },
    preSelectedToken: {
      default: () => {
        return {};
      },
      type: Object
    }
  },
  data() {
    return {
      reservesStable: [],
      reservesData: [],
      rawReserveData: [],
      liquidityRateHistoryUpdate: '',
      userReserveData: [],
      reservesRates30DaysAgo: [],
      usdPriceEth: '',
      userSummary: {},
      isLoadingData: true,
      lendingPool: {},
      poolContract: {},
      priceOracle: {}
    };
  },
  mounted() {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      'https://nodes.mewapi.io/rpc/eth',
      ChainId.mainnet
    );
    /**
     * get lending pool tx methods
     */
    this.lendingPool = new LendingPool(provider, {
      LENDING_POOL: LENDING_POOL,
      REPAY_WITH_COLLATERAL_ADAPTER: REPAY_WITH_COLLATERAL_ADAPTER,
      SWAP_COLLATERAL_ADAPTER: SWAP_COLLATERAL_ADAPTER,
      WETH_GATEWAY: WETH_GATEWAY
    });
    this.poolContract = this.lendingPool.getContractInstance(LENDING_POOL);
    this.priceOracle = new ethers.Contract(PRICE_ORACLE, ABI, provider);
  },
  apollo: {
    $subscribe: {
      /**
       * Apollo subscription to get reserves
       */
      reserveUpdateSubscription: {
        query: ReserveUpdateSubscription,
        variables() {
          return {
            pool: configs.POOL_ID
          };
        },
        client: 'aave',
        result({ data }) {
          Promise.all(data.reserves.map(item => this.rawDataParser(item))).then(
            values => {
              this.rawReserveData = values.filter(
                item => item !== undefined && !item.isFrozen
              );
              this.reservesData = formatReserves({
                reserves: this.rawReserveData,
                currentTimestamp: Math.floor(Date.now() / 1000),
                marketReferenceCurrencyDecimals: 18,
                marketReferencePriceInUsd: 1 / (this.usdPriceEth / 10 ** 18)
              }).reverse();
              this.setFormatUserSummaryData();
            }
          );
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      },
      /**
       * Apollo subscription to get user reserves
       */
      userPositionUpdateSubscription: {
        query: UserPositionUpdateSubscription,
        variables() {
          return {
            userAddress: this.address,
            pool: configs.POOL_ID
          };
        },
        client: 'aave',
        skip() {
          return this.address === null || this.address === '';
        },
        result({ data }) {
          this.userReserveData = data.userReserves.map(item => {
            item.reserve['icon'] =
              this.contractToToken(item.underlyingAsset)?.img || eth;
            return {
              ...item,
              underlyingAsset: item.reserve.underlyingAsset
            };
          });
          this.setFormatUserSummaryData();
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      },
      /**
       * Apollo subscription to get usd price
       */
      usdPriceEth: {
        query: UsdPriceEth,
        client: 'aave',
        result({ data }) {
          this.usdPriceEth = data.priceOracle.usdPriceEth;
          this.setFormatUserSummaryData();
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      }
    }
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['gasPriceType']),
    ...mapGetters('wallet', ['tokensList', 'balanceInWei']),
    ...mapGetters('external', ['contractToToken']),
    ...mapGetters('global', ['getFiatValue', 'gasPriceByType', 'network']),
    userReservesData() {
      return this.userSummary.userReservesData;
    },
    selectedTokenToUse() {
      return this.selectedToken || this.preSelectedToken;
    },
    selectedTokenDetails() {
      return this.reservesData.find(item => {
        if (item.symbol === this.selectedTokenToUse.token) return item;
      });
    },
    selectedTokenUSD() {
      return new BigNumber(
        this.selectedTokenDetails?.price?.priceInEth || 0
      ).times(this.fiatValue);
    },
    selectedTokenInUserSummary() {
      return this.userSummary?.userReservesData?.find(item => {
        if (item.reserve.symbol === this.selectedTokenToUse.token) {
          return item;
        }
      });
    },
    userBorrowingPowerInETH() {
      let buyingPower = 0;
      for (const reserve of this.userReservesData) {
        if (reserve.usageAsCollateralEnabledOnUser) {
          buyingPower +=
            reserve.underlyingBalanceMarketReferenceCurrency *
            reserve.reserve.formattedBaseLTVasCollateral;
        }
      }
      buyingPower -= this.userSummary.totalBorrowsMarketReferenceCurrency;
      if (buyingPower <= 0) buyingPower = 0;
      return buyingPower;
    }
  },
  methods: {
    async rawDataParser(item) {
      const token = this.contractToToken(item.underlyingAsset);
      item['icon'] = token?.img || eth;
      if (item.price.priceInEth === '0') {
        const price = await this.getTokenPrice(item.underlyingAsset);
        item.price.priceInEth = price.toString();
      }
      return {
        ...item,
        priceInMarketReferenceCurrency: item.price.priceInEth,
        eModeCategoryId: 0,
        borrowCap: '',
        supplyCap: '',
        debtCeiling: '',
        debtCeilingDecimals: 0,
        isolationModeTotalDebt: '',
        eModeLtv: 0,
        eModeLiquidationThreshold: 0,
        eModeLiquidationBonus: 0
      };
    },
    /**
     * Deposit funds
     */
    async onDeposit({ amount, reserve, referralCode, user }) {
      try {
        const approveData = await this.formatApprovalData(
          reserve,
          user,
          this.poolContract.address,
          amount
        );
        const txData = await this.poolContract.populateTransaction.deposit(
          reserve,
          amount,
          user,
          referralCode
        );
        txData.from = user;
        const gasLimits = await estimateGasList(this.network.type.name, [
          approveData,
          txData
        ]);
        this.sendTxns([approveData, txData], gasLimits);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to borrow funds
     */
    async onBorrow({ amount, reserve, referralCode, interestRateMode, user }) {
      try {
        const data = [
          reserve,
          amount,
          interestRateMode === INTEREST_TYPES.variable ? 2 : 1,
          referralCode,
          user
        ];
        const txData = await this.poolContract.populateTransaction.borrow(
          ...data
        );
        this.formatTxData(txData);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to repay funds
     *  @param {object} data
     * @param {String} data.user - The ethereum address that repays
     * @param {String} data.reserve - The ethereum address of the reserve on which the user borrowed
     * @param {String|Number} data.amount - The amount to repay, or (-1) if the user wants to repay everything
     * @param data.interestRateMode -  // Whether stable (InterestRate.Stable) or variable (InterestRate.Variable) debt will be repaid
     */
    async onRepay({ amount, reserve, interestRateMode, user }) {
      try {
        const approveData = await this.formatApprovalData(
          reserve,
          user,
          this.poolContract.address,
          amount
        );
        const data = await this.poolContract.populateTransaction.repay(
          reserve,
          amount,
          interestRateMode === INTEREST_TYPES.variable ? 2 : 1,
          user
        );
        data.from = user;
        const gasLimits = await estimateGasList(this.network.type.name, [
          approveData,
          data
        ]);
        this.sendTxns([approveData, data], gasLimits);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to set the borrow rate (stable or variable)
     * function swapBorrowRateMode(address asset, uint256 rateMode)
     * the rate mode the user is swapping from. Stable: 1, Variable: 2
     */
    async setBorrowRate({ reserve, rateMode, symbol }) {
      try {
        const txData =
          await this.poolContract.populateTransaction.swapBorrowRateMode(
            reserve,
            rateMode
          );
        const defaultValue = rateMode === 2;
        const params = {
          reserve: symbol,
          value: defaultValue
        };
        const callback = [this.resetAprToggle, params];
        this.formatTxData(txData, callback);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to withdraw funds
     *
     * @param reserve The ethereum address of the reserve asset
     * @param amount The amount of reserve asset being redeemed
     * @param user The ethereum address that will receive the reserve asset
     */
    async onWithdraw({ reserve, amount, user }) {
      try {
        //  If user has any existing debt backed by the underlying token,
        //  then the max amount available to withdraw is the amount that
        //  will not leave user health factor < 1 after withdrawal.
        const txData = await this.poolContract.populateTransaction.withdraw(
          reserve,
          amount,
          user
        );
        this.formatTxData(txData);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * format transaction data for token approval
     *
     * @param tokenAddress The ethereum address of the token needing approval
     * @param user The ethereum address that owns the asset
     * @param spender The ethereum address that will spend the asset
     * @param amount The amount of asset that will be approved
     */
    async formatApprovalData(tokenAddress, user, spender, amount) {
      try {
        const ABI = [
          'function approve(address _spender, uint256 _value) public returns (bool success)'
        ];
        const token = new ethers.Contract(
          tokenAddress,
          ABI,
          this.poolContract.provider
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
    },
    /**
     * Apollo mutation to enable or disable collateral
     * function setUserUseReserveAsCollateral(address asset, bool useAsCollateral)
     * Sets the asset of msg.sender to be used as collateral or not.
     */
    async setCollateral({ reserve, useAsCollateral, symbol }) {
      try {
        const txData =
          await this.poolContract.populateTransaction.setUserUseReserveAsCollateral(
            reserve,
            useAsCollateral
          );
        const params = {
          reserve: symbol,
          useAsCollateral: !useAsCollateral
        };
        const callback = [this.resetCollateralToggle, params];
        this.formatTxData(txData, callback);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Check and prepare data to send tx
     * or errors out
     */
    formatTxData(txData, callback) {
      try {
        const tx = {
          from: this.address,
          to: txData.to,
          data: txData.data,
          value: '0',
          gasPrice: this.gasPriceByType(this.gasPriceType)
        };
        this.web3.eth
          .estimateGas(tx)
          .then(res => {
            tx['gas'] = toHex(res);
            this.sendTransaction(tx)
              .then(() => {
                Toast(
                  'Success! Your transaction will be displayed shortly',
                  {},
                  SUCCESS
                );
              })
              .catch(err => {
                Toast(err, {}, ERROR);
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
    },
    /**
     * Check and prepare data to send multiple txns
     * or errors out
     */
    sendTxns(txns, gasLimits) {
      try {
        if (!gasLimits) throw new Error('Unable to estimate transaction fees');
        for (let i = 0; i < txns.length; i++) {
          const tx = {
            from: this.address,
            to: txns[i].to,
            data: txns[i].data,
            gas: gasLimits[i],
            value: '0',
            gasPrice: this.gasPriceByType(this.gasPriceType)
          };
          txns[i] = tx;
        }
        let totalGasPrice = toBN(0);
        for (const tx of txns) {
          totalGasPrice = totalGasPrice.add(
            toBN(tx.gasPrice).mul(toBN(tx.gas))
          );
        }
        if (totalGasPrice.gt(toBN(this.balanceInWei))) {
          Toast('Insufficient funds for gas', {}, ERROR);
          return;
        }
        this.web3.mew
          .sendBatchTransactions(txns)
          .then(() => {
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
    },
    /**
     * Sends the tx
     */
    sendTransaction(param) {
      if (param) {
        // if (param.length > 1) {
        //   return this.web3.mew.sendBatchTransactions(param);
        // }
        return this.web3.eth.sendTransaction(param);
      }
      return new Error('No Parameters sent!');
    },
    /**
     * @return object
     * Correctly formats all of the user data
     */
    setFormatUserSummaryData() {
      if (
        this.reservesData?.length > 0 &&
        this.userReserveData &&
        this.usdPriceEth
      ) {
        this.userSummary = formatUserSummary({
          currentTimestamp: Math.floor(Date.now() / 1000),
          marketReferencePriceInUsd: 1 / (this.usdPriceEth / 10 ** 18),
          marketReferenceCurrencyDecimals: 18,
          userReserves: this.userReserveData,
          formattedReserves: this.reservesData,
          userEmodeCategoryId: 0
        });
        this.mergeTheReserves();
      }
    },
    /**
     * Merges the user reserves data into this.reservesData
     */
    mergeTheReserves() {
      if (
        this.userSummary.userReservesData &&
        this.userSummary.userReservesData.length > 0
      ) {
        this.userSummary.userReservesData.forEach(data => {
          const foundReserve = this.reservesData.find(
            elem => elem.name === data.reserve.name
          );
          if (foundReserve) {
            foundReserve.user = data;
          }
        });
      }
      this.getReserveBalances();
    },
    /**
     * Finds the reserves balances
     */
    getReserveBalances() {
      if (this.reservesData.length > 0) {
        this.reservesData.forEach(reserve => {
          reserve.tokenBalance = 0;
          reserve.user = reserve.user || {};
          if (reserve.symbol === 'ETH') {
            reserve.tokenBalance = this.balanceInEth;
          }
          const foundReserve = this.tokensList.find(
            elem => elem.symbol === reserve.symbol
          );
          if (foundReserve) {
            reserve.tokenBalance = foundReserve.balance;
          }
          if (this.reservesStable.length < 5) {
            if (STABLE_COINS.findIndex(coin => coin === reserve.symbol) >= 0) {
              this.reservesStable.push(reserve);
            }
          }
        });
      }
      this.isLoadingData = false;
    },
    /**
     * Format USD value to actual USD amount
     */
    formatUSDValue(usdValue) {
      return 10 ** 8 * usdValue;
    },
    nextTokenHealthFactor(selectedToken, amount) {
      let nextHealthFactor = this.currentHealthFactor,
        totalBorrowsETH = this.userSummary.totalBorrowsMarketReferenceCurrency;
      const collateralBalanceETH =
        this.userSummary.totalCollateralMarketReferenceCurrency;
      if (
        selectedToken?.usageAsCollateralEnabled &&
        selectedToken?.formattedPriceInMarketReferenceCurrency &&
        amount !== '0'
      ) {
        const ethBalance = BigNumber(amount).times(
          selectedToken?.formattedPriceInMarketReferenceCurrency
        );
        totalBorrowsETH = new BigNumber(
          this.userSummary.totalBorrowsMarketReferenceCurrency
        ).plus(ethBalance);
        nextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
          collateralBalanceETH,
          totalBorrowsETH,
          this.userSummary.currentLiquidationThreshold
        ).toFixed(3);
      }
      return nextHealthFactor;
    },
    userBorrowPower(token) {
      let borrowPower = 0;
      const tokenAmount = BigNumber(this.userBorrowingPowerInETH).dividedBy(
        token.formattedPriceInMarketReferenceCurrency
      );
      const healthFactor = this.nextTokenHealthFactor(token, tokenAmount);
      if (healthFactor < 1.1) {
        // recalculate token amount until HF >= 1.1
      }
      borrowPower = tokenAmount;
      return borrowPower.isFinite() && !borrowPower.isNaN() ? borrowPower : 0;
    },
    async getTokenPrice(contractAddress) {
      try {
        return await this.priceOracle.getAssetPrice(contractAddress);
      } catch (e) {
        return '0';
      }
    }
  }
};
