import { isAddress } from '@/core/helpers/addressUtils.js';
import MultiCoinValidator from 'multicoin-address-validator';
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

export function isLegacyBtcAddress(address) {
  if (!address) false;

  return MultiCoinValidator.validate(address, 'Bitcoin');
}
