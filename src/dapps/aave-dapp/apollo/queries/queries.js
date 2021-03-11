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
    this.apollo.subscribe({
      query: UsdPriceEth,
      next: next,
      error: err => {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUserData(next) {
    this.apollo.subscribe({
      query: UserPositionUpdateSubscription,
      next: next,
      error: err => {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getReserveData(next) {
    this.apollo.subscribe({
      query: ReserveUpdateSubscription,
      next: next,
      variables: {
        poolId: Configs.POOL_ID
      },
      error: err => {
        Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }
}
