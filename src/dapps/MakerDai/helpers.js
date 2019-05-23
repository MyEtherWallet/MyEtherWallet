import BigNumber from 'bignumber.js';
import Vue from 'vue';

const Observer = new Vue().$data.__ob__.constructor;

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

export function prevent(val) {
  if (val) {
    // Set dummy observer on value
    Object.defineProperty(val, '__ob__', {
      value: new Observer({}),
      enumerable: false,
      configurable: true
    });
  }

  return val;
}
