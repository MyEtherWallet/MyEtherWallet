/**
 * The Aave Apollo Mixin
 */
import {
  Deposit,
  Borrow,
  Repay,
  SwapBorrowRateMode,
  Withdraw,
  SetUsageAsCollateralMode,
  LiquidityRateHistoryUpdate,
  ReserveUpdateSubscription,
  UserPositionUpdateSubscription
} from '@/dapps/aave-dapp/apollo/queries/aave.graphql';
import { Toast, ERROR, SENTRY } from '@/modules/toast/handler/handlerToast';
import configs from '@/dapps/aave-dapp/apollo/configs';

export default {
  name: 'HandlerAaveApollo',
  data() {
    return {
      ReserveUpdateSubscription: '',
      LiquidityRateHistoryUpdate: '',
      UserPositionUpdateSubscription: ''
    };
  },
  apollo: {
    /**
     * Apollo subscription for liquidity rate history
     */
    $subscribe: {
      LiquidityRateHistoryUpdate: {
        query: LiquidityRateHistoryUpdate,
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
       * Apollo subscription for reserve update
       */
      ReserveUpdateSubscription: {
        query: ReserveUpdateSubscription,
        variables() {
          return {
            poolId: configs.POOL_ID
          };
        },
        client: 'aave',
        result({ data }) {
          console.error('data', data);
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      },
      /**
       * Apollo subscription for user position update
       */
      UserPositionUpdateSubscription: {
        query: UserPositionUpdateSubscription,
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
          console.error('user position', data);
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
          mutation: Deposit,
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
          mutation: Borrow,
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
          mutation: Repay,
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
          mutation: SwapBorrowRateMode,
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
          mutation: Withdraw,
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
          mutation: SetUsageAsCollateralMode,
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
    }
  }
};
