import BigNumber from 'bignumber.js';

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export function displayPercentValue(raw) {
  if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
  return raw.times(100).toString();
}

export function displayFixedValue(raw, decimals = 3, round = true) {
  if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
  if (!isFinite(raw) || isNaN(raw)) return '--';
  if (round) return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
  return raw.toFixed(decimals).toString();
}

export function displayFixedPercent(raw, decimals = 3, round = true) {
  const value = displayFixedValue(displayPercentValue(raw), decimals, round);
  if (isFinite(value) && new BigNumber(value).gt(0)) {
    return value;
  }
  return '--';
}

// Calculations

export function maxDai(ethPrice, ethCollateral, liquidationRatio, debtValue) {
  return bnOver(
    toBigNumber(ethPrice),
    toBigNumber(ethCollateral),
    toBigNumber(liquidationRatio)
  ).minus(toBigNumber(debtValue));
}

export function maxPethDraw(
  pethCollateral,
  liquidationRatio,
  debtValue,
  pethPrice,
  pethMin = 0
) {
  return toBigNumber(pethCollateral)
    .minus(
      bnOver(
        toBigNumber(liquidationRatio).plus(0.001),
        toBigNumber(debtValue),
        toBigNumber(pethPrice)
      )
    )
    .minus(toBigNumber(pethMin).times(1.0));
}

export function maxEthDraw(
  ethCollateral,
  liquidationRatio,
  debtValue,
  ethPrice,
  minEth = 0
) {
  return toBigNumber(ethCollateral)
    .minus(
      bnOver(
        toBigNumber(liquidationRatio),
        toBigNumber(debtValue),
        toBigNumber(ethPrice)
      )
    )
    .minus(toBigNumber(minEth).times(1.0));
}

export function calcCollatRatio(ethQty, daiQty, ethPrice) {
  return bnOver(toBigNumber(ethPrice), ethQty, daiQty);
}

export function calcLiquidationPrice(
  ethQty,
  daiQty,
  ethPrice,
  liquidationRatio
) {
  const getInt = parseInt(ethPrice);
  for (let i = getInt; i > 0; i--) {
    const atValue = bnOver(i, ethQty, daiQty).lte(
      toBigNumber(liquidationRatio)
    );
    if (atValue) {
      return i;
    }
  }
  for (let i = 100; i > 0; i--) {
    const atValue = bnOver(i / 100, ethQty, daiQty).lte(
      toBigNumber(liquidationRatio)
    );
    if (atValue) {
      return i / 100;
    }
  }
  return 0;
}
