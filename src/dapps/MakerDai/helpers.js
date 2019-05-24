import BigNumber from 'bignumber.js';

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
