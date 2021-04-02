import vuexStore from '@/core/store';
import { mapState } from 'vuex';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  LiquidityRateHistoryUpdate,
  UsdPriceEth,
  UserPositionUpdateSubscription,
  ReserveUpdateSubscription
} from './aave.graphql';
import Configs from '../configs';
export default class AaveCalls {
  constructor(apollo) {
    this.apollo = apollo;
    this.$store = vuexStore;
    Object.assign(this, mapState('wallet', ['address']));
  }

  getLiquidityRateHistoryUpdate(param, next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: LiquidityRateHistoryUpdate,
      variables: {
        reserveAddress: param
      },
      client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err) {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUsdPriceEth(next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: UsdPriceEth,
      client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err) {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUserData(next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: UserPositionUpdateSubscription,
      client: 'aave',
      variables: {
        userAddress: this.address(),
        poolId: Configs.POOL_ID
      }
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err) {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getReserveData(next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: ReserveUpdateSubscription,
      variables: {
        poolId: Configs.POOL_ID
      },
      client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err) {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }
}
