import BigNumber from 'bignumber.js';
const SECONDS_PER_YEAR = 31536000;

const BorrowRateMode = {};
BorrowRateMode["None"] = "None";
BorrowRateMode["Stable"] = "Stable";
BorrowRateMode["Variable"] = "Variable";

const toBigNumber = num => {
  return new BigNumber(num);
};
// sets the precision of the pow function to 27 digits, that is the same precision used
// in smart contracts for this calculation
// BigNumber.config({ POW_PRECISION: 27, ROUNDING_MODE: BigNumber.ROUND_HALF_UP });

function getCompoundedBorrowBalance(reserve, userReserve, currentTimestamp) {
  const principalBorrows = toBigNumber(userReserve.principalBorrows);
  if (principalBorrows.eq('0')) {
    return toBigNumber('0');
  }
  const timeDelta = currentTimestamp - userReserve.lastUpdateTimestamp;
  const interestPerSecond = toBigNumber(userReserve.borrowRate).div(SECONDS_PER_YEAR);
  let cumulatedInterest = interestPerSecond.plus(1).pow(timeDelta);
  if (userReserve.borrowRateMode === BorrowRateMode.Variable) {
    cumulatedInterest = cumulatedInterest
      .times(reserve.variableBorrowIndex)
      .dividedBy(userReserve.variableBorrowIndex);
  }
  return principalBorrows.times(cumulatedInterest).plus(userReserve.originationFee);
}

export function calculateHealthFactorFromBalances(collateralBalanceETH, borrowBalanceETH, totalFeesETH, currentLiquidationThreshold) {
  if (borrowBalanceETH.eq(0)) {
    return toBigNumber('-1'); // invalid number
  }
  return collateralBalanceETH
    .times(currentLiquidationThreshold)
    .div(borrowBalanceETH.plus(totalFeesETH));
}

function calculateAvailableBorrowsETH(collateralBalanceETH, borrowBalanceETH, totalFeesETH, currentLtv) {
  if (currentLtv.eq(0)) {
    return toBigNumber('0');
  }
  let availableBorrowsETH = collateralBalanceETH.times(currentLtv);
  if (availableBorrowsETH.lt(borrowBalanceETH)) {
    return toBigNumber('0');
  }
  availableBorrowsETH = availableBorrowsETH.minus(borrowBalanceETH).minus(totalFeesETH);
  const borrowFee = availableBorrowsETH.times(0.0025); // TODO: move to config
  return availableBorrowsETH.minus(borrowFee);
}

function getReserveNormalizedIncome(reserve, currentTimestamp) {
  const timeDifference = toBigNumber(currentTimestamp.toString()).minus(reserve.lastUpdateTimestamp);
  const timeDelta = timeDifference.dividedBy(SECONDS_PER_YEAR);
  const linearInterest = toBigNumber(reserve.liquidityRate).times(timeDelta);
  return linearInterest.plus('1').times(reserve.liquidityIndex);
}

function calculateCumulatedBalance(balance, userReserve, poolReserve, currentTimestamp) {
  return toBigNumber(balance)
    .times(getReserveNormalizedIncome(poolReserve, currentTimestamp))
    .dividedBy(userReserve.userBalanceIndex);
}

function calculateCurrentUnderlyingBalance(userReserve, poolReserve, currentTimestamp) {
  if (userReserve.principalATokenBalance === '0' && userReserve.redirectedBalance === '0') {
    return toBigNumber('0');
  }
  if (userReserve.interestRedirectionAddress !== '0x0000000000000000000000000000000000000000') {
    return toBigNumber(userReserve.principalATokenBalance).plus(calculateCumulatedBalance(userReserve.redirectedBalance, userReserve, poolReserve, currentTimestamp).minus(userReserve.redirectedBalance));
  }
  return calculateCumulatedBalance(toBigNumber(userReserve.redirectedBalance)
    .plus(userReserve.principalATokenBalance)
    .toString(), userReserve, poolReserve, currentTimestamp).minus(userReserve.redirectedBalance);
}

function computeUserReserveData(poolReserve, userReserve, ethUsdPriceRaw, currentTimestamp) {
  const ethUsdPrice = toBigNumber(ethUsdPriceRaw);
  console.log(ethUsdPrice); // todo remove dev item
  const { price: { priceInEth }, } = poolReserve;
  const currentUnderlyingBalance = calculateCurrentUnderlyingBalance(userReserve, poolReserve, currentTimestamp);
  const currentUnderlyingBalanceETH = currentUnderlyingBalance.times(priceInEth);
  const currentUnderlyingBalanceUSD = currentUnderlyingBalanceETH.times(ethUsdPrice);
  const principalBorrowsETH = toBigNumber(userReserve.principalBorrows)
    .times(priceInEth)
    .toFixed();
  const principalBorrowsUSD = ethUsdPrice.times(principalBorrowsETH).toFixed();
  const currentBorrows = getCompoundedBorrowBalance(poolReserve, userReserve, currentTimestamp).toString();
  const currentBorrowsETH = toBigNumber(currentBorrows)
    .times(priceInEth)
    .toFixed();
  const currentBorrowsUSD = ethUsdPrice.times(currentBorrowsETH).toFixed();
  const originationFeeETH = toBigNumber(userReserve.originationFee)
    .times(priceInEth)
    .toFixed();
  const originationFeeUSD = ethUsdPrice.times(originationFeeETH).toFixed();
  return Object.assign(Object.assign({}, userReserve), { principalBorrowsETH,
    principalBorrowsUSD,
    currentBorrows,
    currentBorrowsETH,
    currentBorrowsUSD,
    originationFeeETH,
    originationFeeUSD, currentUnderlyingBalance: currentUnderlyingBalance.toFixed(), currentUnderlyingBalanceETH: currentUnderlyingBalanceETH.toFixed(), currentUnderlyingBalanceUSD: currentUnderlyingBalanceUSD.toFixed() });
}

export function computeUserSummaryData(poolReservesData, rawUserReserves, userId, ethUsdPrice, currentTimestamp) {
  let totalLiquidityETH = toBigNumber('0');
  let totalCollateralETH = toBigNumber('0');
  let totalBorrowsETH = toBigNumber('0');
  let totalFeesETH = toBigNumber('0');
  let currentLtv = toBigNumber('0');
  let currentLiquidationThreshold = toBigNumber('0');
  const userReservesData = rawUserReserves
    .map(userReserve => {
      const poolReserve = poolReservesData.find(reserve => reserve.id === userReserve.reserve.id);
      if (!poolReserve) {
        // TODO: check, is it possible or not
        throw new Error('Reserve is not registered on platform, please contact support');
      }
      const computedUserReserve = computeUserReserveData(poolReserve, userReserve, toBigNumber(ethUsdPrice), currentTimestamp);
      totalLiquidityETH = totalLiquidityETH.plus(computedUserReserve.currentUnderlyingBalanceETH);
      totalBorrowsETH = totalBorrowsETH.plus(computedUserReserve.currentBorrowsETH);
      totalFeesETH = totalFeesETH.plus(computedUserReserve.originationFeeETH);
      // asset enabled as collateral
      if (poolReserve.usageAsCollateralEnabled && userReserve.usageAsCollateralEnabledOnUser) {
        totalCollateralETH = totalCollateralETH.plus(computedUserReserve.currentUnderlyingBalanceETH);
        currentLtv = currentLtv.plus(toBigNumber(computedUserReserve.currentUnderlyingBalanceETH).times(poolReserve.baseLTVasCollateral));
        currentLiquidationThreshold = currentLiquidationThreshold.plus(toBigNumber(computedUserReserve.currentUnderlyingBalanceETH).times(poolReserve.reserveLiquidationThreshold));
      }
      return computedUserReserve;
    })
    .sort((a, b) => a.reserve.symbol > b.reserve.symbol ? 1 : a.reserve.symbol < b.reserve.symbol ? -1 : 0);
  if (currentLtv.gt(0)) {
    currentLtv = currentLtv.div(totalCollateralETH).precision(2, BigNumber.ROUND_DOWN);
  }
  if (currentLiquidationThreshold.gt(0)) {
    currentLiquidationThreshold = currentLiquidationThreshold
      .div(totalCollateralETH)
      .precision(2, BigNumber.ROUND_DOWN);
  }

  const healthFactor = calculateHealthFactorFromBalances(totalCollateralETH, totalBorrowsETH, totalFeesETH, currentLiquidationThreshold);

  const totalCollateralUSD = toBigNumber(ethUsdPrice).times(totalCollateralETH);

  const totalLiquidityUSD = toBigNumber(ethUsdPrice).times(totalLiquidityETH);
  const totalBorrowsUSD = toBigNumber(ethUsdPrice).times(totalBorrowsETH);
  const availableBorrowsETH = calculateAvailableBorrowsETH(totalCollateralETH, totalBorrowsETH, totalFeesETH, currentLtv);
  const totalBorrowsAndFeesETH = totalBorrowsETH.plus(totalFeesETH);
  const maxAmountToWithdrawInEth = totalLiquidityETH.minus(totalBorrowsAndFeesETH.eq(0)
    ? '0'
    : totalBorrowsAndFeesETH.dividedBy(currentLiquidationThreshold));
  return {
    id: userId,
    totalLiquidityETH: totalLiquidityETH.toString(),
    totalLiquidityUSD: totalLiquidityUSD.toString(),
    totalCollateralETH: totalCollateralETH.toString(),
    totalCollateralUSD: totalCollateralUSD.toString(),
    totalFeesETH: totalFeesETH.toString(),
    totalBorrowsETH: totalBorrowsETH.toString(),
    totalBorrowsUSD: totalBorrowsUSD.toString(),
    availableBorrowsETH: availableBorrowsETH.toString(),
    currentLoanToValue: currentLtv.toString(),
    currentLiquidationThreshold: currentLiquidationThreshold.toString(),
    maxAmountToWithdrawInEth: maxAmountToWithdrawInEth.toString(),
    healthFactor: healthFactor.toString(),
    reservesData: userReservesData,
  };
}
