const POOL_ID = '0x24a42fd28c976a61df5d00d0599c34c4f90748c8';

export default class AaveHandler {
  constructor() {
    this.poolId = POOL_ID;
    this.reservesData = [];
    this.reservesData = [];
    this.rawReserveData = [];
    this.reservesStable = [];
    this.actionType = '';
    this.userReserveData = [];
    this.token = {};
    this.usdPriceEth = '';
    this.userSummary = {};
    this.rateHistory = { labels: [], stableRates: [], variableRates: [] };
    // this.pendingToken = {};
    this.compositionDeposit = [];
    this.compositionBorrow = [];
    this.compositionCollateral = [];
    this.percentageLeft = '';
  }
}
