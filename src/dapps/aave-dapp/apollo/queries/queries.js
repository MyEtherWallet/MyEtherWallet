import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  LiquidityRateHistoryUpdate,
  UsdPriceEth,
  UserPositionUpdateSubscription,
  ReserveUpdateSubscription
} from './aave.graphql';
import Configs from '../configs';
export default class AaveCalls {
  constructor(apollo, address) {
    this.apollo = apollo.provider.clients.aave;
    this.address = address;
  }

  getLiquidityRateHistoryUpdate(param, next) {
    console.log('i got called getLiquidityRateHistoryUpdate');
    this.apollo.subscribe({
      query: LiquidityRateHistoryUpdate,
      variables: {
        reserveAddress: param
      },
      next: function (res) {
        console.log(res);
        next(res);
      },
      error: function (err) {
        console.log(err, 'getLiquidityRateHistoryUpdate');
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUsdPriceEth(next) {
    console.log('i got called getUsdPriceEth');
    this.apollo.subscribe({
      query: UsdPriceEth,
      next: function (res) {
        console.log(res);
        next(res);
      },
      error: function (err) {
        console.log(err, 'getUsdPriceEth');
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUserData(next) {
    console.log('i got called getUserData');
    this.apollo.subscribe({
      query: UserPositionUpdateSubscription,
      next: function (res) {
        console.log(res);
        next(res);
      },
      error: function (err) {
        console.log(err, 'getUserData');
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getReserveData(next) {
    console.log('i got called getReserveData');
    this.apollo.subscribe({
      query: ReserveUpdateSubscription,
      next: function (res) {
        console.log(res);
        next(res);
      },
      variables: {
        poolId: Configs.POOL_ID
      },
      error: function (err) {
        console.log(err, 'getReserveData');
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }
}
