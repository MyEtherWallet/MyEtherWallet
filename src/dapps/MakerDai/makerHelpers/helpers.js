import BigNumber from 'bignumber.js';
import { ERC20 } from './ABIs';

export function toBigNumber(num) {
  const bignumber = new BigNumber(num);
  bignumber.displayFixed = displayFixedValue.bind(this, bignumber);
  return new BigNumber(num);
}

export function toNumber(val) {
  if (BigNumber.isBigNumber(val)) {
    return val.toNumber();
  }
  return toBigNumber(val).toNumber();
}

export function displayPercentValue(raw) {
  if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
  return raw.times(100).toString();
}

export function displayFixedValue(
  raw,
  decimals = 3,
  finiteCheck = true,
  round = true,
  roundUp = false
) {
  try {
    if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
    if ((!isFinite(raw) || isNaN(raw)) && finiteCheck) return '--';
    if (round && !roundUp)
      return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
    if (round && roundUp)
      return raw.toFixed(decimals, BigNumber.ROUND_UP).toString();

    return raw.toFixed(decimals).toString();
  } catch (e) {
    return '--';
  }
}

export function displayFixedPercent(raw, decimals = 3, round = true) {
  try {
    const value = displayFixedValue(displayPercentValue(raw), decimals, round);
    if (isFinite(value) && new BigNumber(value).gt(0)) {
      return value;
    }
    return '--';
  } catch (e) {
    return '--';
  }
}

/**
 * @return {number}
 */
export function CdpNum(cdpId) {
  if (cdpId === undefined) return 0;
  return typeof cdpId === 'number'
    ? cdpId
    : typeof cdpId === 'object'
    ? 0
    : cdpId.hasOwnProperty('id')
    ? cdpId.id
    : 0;
}

// Calculations
export function bnOver(one, two, three) {
  return toBigNumber(one).times(toBigNumber(two)).div(toBigNumber(three));
}

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

export function calcCollatRatio(ethPrice, ethQty, daiQty) {
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
  return toBigNumber(0.01);
}

export function checkAllowance(web3, tokenAddress, userAddress, proxyAddress) {
  const contract = new web3.eth.contract(ERC20, tokenAddress);
  return contract.methods.allowance(userAddress, proxyAddress).call();
}
