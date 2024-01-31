import { isAddress } from '@/core/helpers/addressUtils.js';

export function isAmountValid(amount, min, max) {
  const val = parseFloat(amount);

  if (!isNaN(val) && val >= min && val <= max) {
    return true;
  }

  return false;
}

export function isRootstockAddress(address) {
  return isAddress(address);
}

const LEGACY_MAINNET_REGEX = /^[1]([a-km-zA-HJ-NP-Z1-9]{25,34})$/;

export function isLegacyBtcAddress(address) {
  if (!address) false;

  return LEGACY_MAINNET_REGEX.test(address);
}
