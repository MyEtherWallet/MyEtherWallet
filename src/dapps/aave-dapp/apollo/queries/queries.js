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
    this.apollo = apollo;
    this.address = address;
  }

  getLiquidityRateHistoryUpdate(param, next) {
    console.log('i got called getLiquidityRateHistoryUpdate');
    this.apollo.subscribe({
      query: LiquidityRateHistoryUpdate,
      variables: {
        reserveAddress: param
      },
      client: 'aave',
      next: next,
      error: err => {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUsdPriceEth(next) {
    console.log('i got called getUsdPriceEth');
    this.apollo.subscribe({
      query: UsdPriceEth,
      next: next,
      client: 'aave',
      error: err => {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUserData(next) {
    console.log('i got called getUserData');
    this.apollo.subscribe({
      query: UserPositionUpdateSubscription,
      next: next,
      client: 'aave',
      error: err => {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getReserveData(next) {
    console.log('i got called getReserveData');
    this.apollo.subscribe({
      query: ReserveUpdateSubscription,
      next: next,
      client: 'aave',
      variables: {
        poolId: Configs.POOL_ID
      },
      error: err => {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }
}
