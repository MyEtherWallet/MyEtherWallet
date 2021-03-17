import {
  depositDetails,
  borrowDetails,
  repayDetails,
  swapBorrowRateDetails,
  setUsageAsCollateralDetails,
  withdrawDetails
} from './graphQLHelpers.js';

import vuexStore from '@/core/store';
import { mapState, mapGetters } from 'vuex';
import {
  formatUserSummaryData,
  formatReserves,
  normalize
} from '@aave/protocol-js';
import moment from 'moment';
import BigNumber from 'bignumber.js';

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

export default class AaveHandler {
  constructor() {
    this.$store = vuexStore;
    Object.assign(this, mapState('wallet', ['web3', 'address']));
    Object.assign(this, mapGetters('wallet', ['tokensList', 'balanceInETH']));
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

  sendTransaction(param) {
    if (param) {
      if (param.length > 1) {
        return this.web3().mew.sendBatchTransactions(param);
      }
      return this.web3().sendTransaction(param[0]);
    }
    return new Error('No Parameters sent!');
  }

  borrow(param) {
    param.referralCode = '14';
    try {
      return borrowDetails(param).then(res => {
        const txArr = [];
        res.data.borrow.forEach(data => {
          txArr.push(data.tx);
        });
        this.sendTransaction(txArr);
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  deposit(param) {
    param.referralCode = '14';
    try {
      return depositDetails(param).then(res => {
        const txArr = [];
        res.data.deposit.forEach(data => {
          txArr.push(data.tx);
        });
        this.sendTransaction(txArr);
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  withdraw(param) {
    try {
      return withdrawDetails(param).then(res => {
        const txArr = [];
        res.data.redeem.forEach(data => {
          txArr.push(data.tx);
        });
        this.sendTransaction(txArr);
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  switchCollateral(param) {
    try {
      return setUsageAsCollateralDetails(param).then(res => {
        const txArr = [];
        res.data.setUsageAsCollateral.forEach(data => {
          txArr.push(data.tx);
        });

        this.sendTransaction(txArr);
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  switchRate(param) {
    try {
      return swapBorrowRateDetails(param).then(res => {
        const txArr = [];
        res.data.swapBorrowRateMode.forEach(data => {
          txArr.push(data.tx);
        });

        this.sendTransaction(txArr);
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  repay(param) {
    try {
      return repayDetails(param).then(res => {
        const txArr = [];
        res.data.repay.forEach(data => {
          txArr.push(data.tx);
        });

        this.sendTransaction(txArr);
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  // aave calls

  getLiquidityRateHistoryUpdate(id, next) {
    this.aaveCalls.getLiquidityRateHistoryUpdate(id, next);
  }

  // setters (?)

  setFormatUserSummaryData() {
    if (
      this.reservesData.length > 0 &&
      this.userReserveData &&
      this.usdPriceEth
    ) {
      this.userSummary = formatUserSummaryData(
        this.rawReserveData,
        this.userReserveData,
        this.address().toLowerCase(),
        this.usdPriceEth,
        Number(moment().format('X'))
      );
      console.log(this.userSummary);
    }
  }

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
  }

  getReserveBalances() {
    const utils = this.web3().utils;
    const accountBalance = utils.BN(this.balanceInETH());
    if (this.reservesData.length > 0) {
      this.reservesData.forEach(reserve => {
        reserve.tokenBalance = 0;
        reserve.user = !reserve.user ? {} : reserve.user;
        if (reserve.symbol === 'ETH') {
          reserve.tokenBalance = this.web3().utils.fromWei(
            accountBalance,
            'ether'
          );
        }

        const foundReserve = this.tokensList().find(
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
  }

  _liquidityRateHandler(res) {
    const data = res.data.userReserves;
    const rateHistory = { labels: [], stableRates: [], variableRates: [] };
    const rayDecimals = 27;
    const sortedData = data.sort((a, b) => a.timestamp - b.timestamp);
    sortedData.forEach(item => {
      const date = moment.unix(item.timestamp).format('MMM Do');
      rateHistory.labels.push(date);
      rateHistory.stableRates.push(
        new BigNumber(normalize(item.stableBorrowRate, rayDecimals))
          .times(100)
          .toFixed(2)
      );
      rateHistory.variableRates.push(
        new BigNumber(normalize(item.variableBorrowRate, rayDecimals))
          .times(100)
          .toFixed(2)
      );
    });

    this.rateHistory = rateHistory;
  }

  _usdPriceHandler(res) {
    const data = res.data.priceOracle;
    this.usdPriceEth = data;
    this.setFormatUserSummaryData();
  }

  _userDataHandler(res) {
    const data = res.data.userReserves;
    this.userReservData = data;
    this.setFormatUserSummaryData();
  }

  _reserveDataHandler(res) {
    const data = res.data.reserves;
    this.rawReserveData = data;
    this.reservesData = formatReserves(data).reverse();
    this.setFormatUserSummaryData();
  }
}
