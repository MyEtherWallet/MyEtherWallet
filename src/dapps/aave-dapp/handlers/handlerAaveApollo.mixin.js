/**
 * The Aave Apollo Mixin
 */
import {
  reserveUpdateSubscription,
  userPositionUpdateSubscription,
  usdPriceEth
} from '@/dapps/aave-dapp/apollo/queries/aave.graphql';
import { Toast, SUCCESS, ERROR } from '@/modules/toast/handler/handlerToast';
import configs from '@/dapps/aave-dapp/apollo/configs';
import { formatUserSummaryData, formatReserves } from '@aave/protocol-js';
import eth from '@/assets/images/currencies/eth.png';
import {
  depositDetails,
  borrowDetails,
  repayDetails,
  swapBorrowRateDetails,
  setUsageAsCollateralDetails,
  withdrawDetails
} from './graphQLHelpers.js';

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

export default {
  name: 'HandlerAaveApollo',
  data() {
    return {
      reservesStable: [],
      reservesData: [],
      rawReserveData: [],
      liquidityRateHistoryUpdate: '',
      userReserveData: [],
      reservesRates30DaysAgo: [],
      usdPriceEth: '',
      userSummary: {}
    };
  },
  apollo: {
    $subscribe: {
      /**
       * Apollo subscription to get reserves
       */
      reserveUpdateSubscription: {
        query: reserveUpdateSubscription,
        variables() {
          return {
            poolId: configs.POOL_ID
          };
        },
        client: 'aave',
        result({ data }) {
          this.rawReserveData = data.reserves.map(item => {
            item['icon'] = this.findCoinToken(
              item.reserve?.underlyingAsset
            )?.image;
            return item;
          });
          this.reservesData = formatReserves(this.rawReserveData).reverse();
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
        query: userPositionUpdateSubscription,
        variables() {
          return {
            userAddress: this.address,
            poolId: configs.POOL_ID
          };
        },
        client: 'aave',
        skip() {
          return this.address === null || this.address === '';
        },
        result({ data }) {
          this.userReserveData = data.userReserves.map(item => {
            item.reserve['icon'] = this.findCoinToken(
              item.reserve?.underlyingAsset
            )?.image;
            return item;
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
        query: usdPriceEth,
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
  methods: {
    /**
     * Apollo mutation to deposit funds
     */
    async onDeposit(data) {
      try {
        return await depositDetails(data).then(res => {
          const txArr = [];
          if (res.data.length !== 0) {
            res.data.deposit.forEach(data => {
              txArr.push(data.tx);
            });
            return this.sendTransaction(txArr);
          }
          if (res.errors.length !== 0) {
            throw new Error(
              'You may not have enough token balance or eth to execute transaction!'
            );
          }
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to borrow funds
     */
    async onBorrow(data) {
      console.error('param', data);
      data.referralCode = '14';
      try {
        return await borrowDetails(data).then(res => {
          console.error('res', res);
          const txArr = [];
          if (res.data.length !== 0) {
            res.data.borrow.forEach(data => {
              txArr.push(data.tx);
            });
            return this.sendTransaction(txArr);
          }
          if (res.errors.length !== 0) {
            throw new Error(
              'You may not have enough token balance or eth to execute transaction!'
            );
          }
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to repay funds
     */
    async onRepay(data) {
      try {
        return await repayDetails(data).then(res => {
          const txArr = [];
          if (res.data.length !== 0) {
            res.data.repay.forEach(data => {
              txArr.push(data.tx);
            });
            return this.sendTransaction(txArr);
          }
          if (res.errors.length !== 0) {
            throw new Error(
              'You may not have enough token balance or eth to execute transaction!'
            );
          }
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to set the borrow rate (stable or variable)
     */
    async setBorrowRate(data) {
      try {
        return await swapBorrowRateDetails(data).then(res => {
          const txArr = [];
          if (res.data.length !== 0) {
            res.data.swapBorrowRateMode.forEach(data => {
              txArr.push(data.tx);
            });
            return this.sendTransaction(txArr);
          }
          if (res.errors.length !== 0) {
            throw new Error(
              'You may not have enough token balance or eth to execute transaction!'
            );
          }
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to withdraw funds
     */
    async onWithdraw(data) {
      try {
        return await withdrawDetails(data).then(res => {
          const txArr = [];
          if (res.data.length !== 0) {
            res.data.redeem.forEach(data => {
              txArr.push(data.tx);
            });
            return this.sendTransaction(txArr);
          }
          if (res.errors.length !== 0) {
            throw new Error(
              'You may not have enough token balance or eth to execute transaction!'
            );
          }
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    /**
     * Apollo mutation to enable or disable collateral
     */
    async setCollateral(data) {
      try {
        return await setUsageAsCollateralDetails(data).then(res => {
          const txArr = [];
          if (res.data.length !== 0) {
            res.data.setUsageAsCollateral.forEach(data => {
              txArr.push(data.tx);
            });
          }
          if (res.errors.length !== 0) {
            throw new Error(
              'You may not have enough token balance or eth to execute transaction!'
            );
          }

          return this.sendTransaction(txArr);
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    sendTransaction(param) {
      if (param) {
        if (param.length > 1) {
          return this.web3.mew.sendBatchTransactions(param).then(() => {
            Toast(
              'Success! Your transaction will be displayed shortly',
              {},
              SUCCESS
            );
          });
        }
        return this.web3.eth.sendTransaction(param[0]).then(() => {
          Toast(
            'Success! Your transaction will be displayed shortly',
            {},
            SUCCESS
          );
        });
      }
      return new Error('No Parameters sent!');
    },
    /**
     * @return object
     * Find token from getLatestPrices query
     * Data comes from coingecko
     */
    findCoinToken(hash) {
      if (this.coinGeckoTokens && this.coinGeckoTokens.get && hash) {
        return this.coinGeckoTokens.get(hash.toLowerCase()) || { image: eth };
      }
      return { image: eth };
    },
    /**
     * @return object
     * Correctly formats all of the user data
     */
    setFormatUserSummaryData() {
      if (
        this.rawReserveData?.length > 0 &&
        this.userReserveData &&
        this.usdPriceEth
      ) {
        this.userSummary = formatUserSummaryData(
          this.rawReserveData,
          this.userReserveData,
          this.address.toLowerCase(),
          this.usdPriceEth,
          Math.floor(Date.now() / 1000)
        );
        this.mergeTheReserves();
      }
    },
    /**
     * Merges the user reserves data into this.reservesData
     */
    mergeTheReserves() {
      if (this.userSummary.reservesData.length > 0) {
        this.userSummary.reservesData.forEach(data => {
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
      this.isLoading = false;
    }
  }
};
