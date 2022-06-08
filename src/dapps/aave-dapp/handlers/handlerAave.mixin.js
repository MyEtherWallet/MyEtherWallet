/**
 * The Aave Apollo Mixin
 */
import {
  ReserveUpdateSubscription,
  UserPositionUpdateSubscription,
  UsdPriceEth
} from '@/dapps/aave-dapp/apollo/graphql/subscriptions';
import { Toast, SUCCESS, ERROR } from '@/modules/toast/handler/handlerToast';
import configs from '@/dapps/aave-dapp/apollo/configs';
import eth from '@/assets/images/currencies/eth.png';
import { LendingPool } from '@aave/contract-helpers';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { formatReserves, formatUserSummary } from '@aave/math-utils';
import { ethers } from 'ethers';
import { ChainId } from '@aave/contract-helpers';
// import { toHex } from 'web3-utils';
// import { cloneDeep } from 'lodash';
import { INTEREST_TYPES } from '../handlers/helpers';

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

const LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const REPAY_WITH_COLLATERAL_ADAPTER =
  '0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6';
const SWAP_COLLATERAL_ADAPTER = '0x135896DE8421be2ec868E0b811006171D9df802A';
const WETH_GATEWAY = '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04';

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
      poolContract: {}
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
    console.log('aave', this.poolContract);
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
          this.rawReserveData = data.reserves.map(item => {
            item['icon'] =
              this.contractToToken(item.underlyingAsset)?.img || eth;
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
          });
          this.reservesData = formatReserves({
            reserves: this.rawReserveData,
            currentTimestamp: Math.floor(Date.now() / 1000),
            marketReferenceCurrencyDecimals: 18,
            marketReferencePriceInUsd: 1 / (this.usdPriceEth / 10 ** 18)
          }).reverse();
          this.setFormatUserSummaryData();
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
    ...mapGetters('wallet', ['tokensList']),
    ...mapGetters('external', ['contractToToken']),
    ...mapGetters('global', ['getFiatValue']),
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
      return this.userSummary?.reservesData?.find(item => {
        if (item.reserve.symbol === this.selectedTokenToUse.token) {
          return item;
        }
      });
    },
    amountUsd() {
      return this.getFiatValue(
        BigNumber(this.selectedTokenUSD).times(this.amount || 0)
      );
    }
  },
  methods: {
    /**
     * Deposit funds
     */
    async onDeposit({ amount, reserve, referralCode, user }) {
      try {
        const txData = await this.poolContract.populateTransaction.deposit(
          reserve,
          amount,
          user,
          referralCode
        );
        this.formatTxData(txData);
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
        //const gas = await this.poolContract.estimateGas.borrow(...data);
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
    async onRepay({ amount, reserve, referralCode, interestRateMode, user }) {
      try {
        const data = await this.poolContract.repay(
          reserve,
          amount,
          interestRateMode === INTEREST_TYPES.variable ? 2 : 1,
          referralCode,
          user
        );
        this.formatTxData(data);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to set the borrow rate (stable or variable)
     */
    async setBorrowRate(data) {
      try {
        return await this.lendingPool.swapBorrowRateMode(data).then(res => {
          this.formatTxData(res, 'swapBorrowRateMode');
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to withdraw funds
     *
     * @param user The ethereum address that will receive the aTokens
     * @param reserve The ethereum address of the reserve asset
     * @param amount The amount of aToken being redeemed
     * @param aTokenAddress @optional The ethereum address of the aToken. Only needed if the reserve is ETH mock address
     * @param onBehalfOf @optional The amount of aToken being redeemed. It will default to the user address
     */
    async onWithdraw({ user, reserve, amount, aTokenAddress, onBehalfOf }) {
      try {
        const data = await this.poolContract.withdraw(
          user,
          reserve,
          amount,
          aTokenAddress,
          onBehalfOf
        );
        this.formatTxData(data);
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to enable or disable collateral
     */
    async setCollateral(data) {
      try {
        return await this.lendingPool.setUsageAsCollateral(data).then(res => {
          this.formatTxData(res, 'setUsageAsCollateral');
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Check and prepare data to send tx
     * or errors out
     */
    formatTxData(txData) {
      // if (txData.length > 0) {
      //   txData.forEach(data => {
      //     txArr.push(data.tx);
      //   });
      // }
      this.sendTransaction({
        from: this.address,
        gas: '0x5208',
        to: txData.to,
        data: txData.data
      })
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
    }
  }
};
