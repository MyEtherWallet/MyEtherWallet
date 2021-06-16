/**
 * The Aave Apollo Mixin
 */
import {
  deposit,
  borrow,
  repay,
  swapBorrowRateMode,
  withdraw,
  setUsageAsCollateralMode,
  liquidityRateHistoryUpdate,
  reserveUpdateSubscription,
  userPositionUpdateSubscription,
  usdPriceEth
} from '@/dapps/aave-dapp/apollo/queries/aave.graphql';
import { Toast, ERROR, SENTRY } from '@/modules/toast/handler/handlerToast';
import configs from '@/dapps/aave-dapp/apollo/configs';
import { formatUserSummaryData, formatReserves } from '@aave/protocol-js';
import moment from 'moment';
import eth from '@/assets/images/currencies/eth.png';

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
      usdPriceEth: '',
      userSummary: {}
    };
  },
  apollo: {
    /**
     * Apollo subscription to get liquidity rate history
     */
    $subscribe: {
      liquidityRateHistoryUpdate: {
        query: liquidityRateHistoryUpdate,
        variables() {
          return {
            owner: this.address
            // event: AddressEventType.NEW_ETH_TRANSFER
          };
        },
        skip() {
          // return (
          //   !this.isEthNetwork || this.address === '' || this.address === null
          // );
        },
        result() {
          // this.$apollo.queries.getEthBalance?.refetch();
        },
        error(error) {
          Toast(error.message, {}, SENTRY);
        }
      },
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
    onDeposit(data) {
      this.$apollo
        .mutate({
          mutation: deposit,
          variables: data,
          update: (store, { data: { deposit } }) => {
            console.log('store', store, deposit);
          }
        })
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    /**
     * Apollo mutation to borrow funds
     */
    onBorrow(data) {
      this.$apollo
        .mutate({
          mutation: borrow,
          variables: data,
          update: (store, { data: { borrow } }) => {
            console.log('store', store, borrow);
          }
        })
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    /**
     * Apollo mutation to repay funds
     */
    onRepay(data) {
      this.$apollo
        .mutate({
          mutation: repay,
          variables: data,
          update: (store, { data: { repay } }) => {
            console.log('store', store, repay);
          }
        })
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    /**
     * Apollo mutation to set the borrow rate (stable or variable)
     */
    setBorrowRate(data) {
      this.$apollo
        .mutate({
          mutation: swapBorrowRateMode,
          variables: data,
          update: (store, { data: { swapBorrowRateMode } }) => {
            console.log('store', store, swapBorrowRateMode);
          }
        })
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    /**
     * Apollo mutation to withdraw funds
     */
    onWithdraw(data) {
      this.$apollo
        .mutate({
          mutation: withdraw,
          variables: data,
          update: (store, { data: { withdraw } }) => {
            console.log('store', store, withdraw);
          }
        })
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    /**
     * Apollo mutation to enable or disable collateral
     */
    setCollateral(data) {
      this.$apollo
        .mutate({
          mutation: setUsageAsCollateralMode,
          variables: data,
          update: (store, { data: { setUsageAsCollateralMode } }) => {
            console.log('store', store, setUsageAsCollateralMode);
          }
        })
        .then(resp => {
          console.error('resp', resp);
        })
        .catch(err => {
          console.error('err', err);
        });
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
          Number(moment().format('X'))
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
          foundReserve.user = data;
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
