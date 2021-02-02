import {
  depositDetails,
  borrowDetails,
  repayDetails,
  swapBorrowRateDetails,
  setUsageAsCollateralDetails,
  withdrawDetails
} from './graphQLHelpers.js';

import {
  formatUserSummaryData,
  formatReserves,
  normalize
} from '@aave/protocol-js';

import moment from 'moment';

const POOL_ID = '0x24a42fd28c976a61df5d00d0599c34c4f90748c8';
const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

export default class AaveHandler {
  constructor(web3, address, balance, tokensList) {
    // will be changed with the new vuex store
    this.web3 = web3;
    this.address = address.toLowerCase();
    this.balance = balance;
    this.tokensList = tokensList;

    this.poolId = POOL_ID;
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
        return this.web3.mew.sendBatchTransactions(param);
      }
      return this.web3.sendTransaction(param[0]);
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

  // setters (?)
  setReserveData(data) {
    this.rawReserveData = data;
    this.reservesData = formatReserves(data).reverse();
    this.getFormatUserSummaryData();
  }

  setUserReserveData(data) {
    this.userReservData = data;
    this.getFormatUserSummaryData();
  }

  setUsdPriceEth(data) {
    this.usdPriceEth = data;
    this.getFormatUserSummaryData();
  }

  setFormatUserSummaryData() {
    if (
      this.reservesData.length > 0 &&
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
    const utils = this.web3.utils;
    const accountBalance = utils.BN(this.balance);
    if (this.reservesData.length > 0) {
      this.reservesData.forEach(reserve => {
        reserve.tokenBalance = 0;
        reserve.user = !reserve.user ? {} : reserve.user;
        if (reserve.symbol === 'ETH') {
          reserve.tokenBalance = this.web3.utils.fromWei(
            accountBalance,
            'ether'
          );
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
  }
}
