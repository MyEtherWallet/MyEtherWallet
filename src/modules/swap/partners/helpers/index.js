import {
  bestRateForQuantity,
  bestProviderForQuantity,
  dynamicSortMultiple
} from './sortAndIdentify';
import * as utils from './utils';
import qrcodeBuilder from './qrCodeBuilder';
import hasIcon from './haveIcon';
import { canValidateMulticoin, canValidateCoin } from './canValidate';
import { get, post } from './httpRequests';
const isValidEntry = utils.isValidEntry;
const checkInvalidOrMissingValue = utils.checkInvalidOrMissingValue;

export {
  utils,
  get,
  post,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  checkInvalidOrMissingValue,
  dynamicSortMultiple,
  qrcodeBuilder,
  hasIcon,
  canValidateMulticoin,
  canValidateCoin
};
