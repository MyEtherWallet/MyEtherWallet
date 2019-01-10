import {
  bestRateForQuantity,
  bestProviderForQuantity,
  dynamicSortMultiple
} from './sortAndIdentify';
import * as utils from './utils';
import qrcodeBuilder from './qrCodeBuilder';

const isValidEntry = utils.isValidEntry;
const checkInvalidOrMissingValue = utils.checkInvalidOrMissingValue;

export {
  utils,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  checkInvalidOrMissingValue,
  dynamicSortMultiple,
  qrcodeBuilder
};
