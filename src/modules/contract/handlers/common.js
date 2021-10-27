import { isInt, stringToArray } from '@/core/helpers/common';
import {
  address,
  bool,
  bytes,
  int,
  string,
  uint
} from '@/modules/contract/handlers/solidityTypes';
import { isAddress } from '@/core/helpers/addressUtils';
import validateHexString from '@/core/helpers/validateHexString';

const isContractArgValid = (value, solidityType) => {
  try {
    if (!value && typeof value !== 'boolean') value = '';
    if (solidityType.includes('[]')) {
      const parsedValue = Array.isArray(value) ? value : stringToArray(value);
      const type = solidityType.replace('[]', '');
      for (const parsedItem of parsedValue) {
        if (!isContractArgValid(parsedItem, type)) return false;
      }
      return true;
    }
    if (solidityType.includes(uint) || solidityType.includes(int)) {
      return (
        value !== '' && !isNaN(value) && isInt(value) && !hasWhiteSpace(value)
      );
    } else if (solidityType === address) return isAddress(value);
    else if (solidityType === string) return true;
    else if (solidityType.includes(bytes))
      return value.substr(0, 2) === '0x' && validateHexString(value);
    else if (solidityType === bool)
      return typeof value === typeof true || typeof value === typeof false;
    return false;
  } catch (e) {
    return false;
  }
};
const getType = inputType => {
  if (!inputType) inputType = '';
  if (inputType.includes('[]')) {
    return { type: 'string', solidityType: `${inputType}` };
  }
  if (inputType.includes(uint) || inputType.includes(int))
    return { type: 'number', solidityType: uint };
  else if (inputType.includes(address))
    return { type: 'text', solidityType: address };
  else if (inputType.includes(string))
    return { type: 'text', solidityType: string };
  else if (inputType.includes(bytes))
    return { type: 'text', solidityType: bytes };
  else if (inputType.includes(bool))
    return { type: 'radio', solidityType: bool };
  return { type: 'text', solidityType: string };
};
const parseABI = json => {
  if (json === '') return false;
  try {
    const value = JSON.parse(json);
    if (Array.isArray(value)) {
      if (value.length > 0) {
        return value;
      }
    }
    return JSON.parse(json);
  } catch (e) {
    if (Array.isArray(json)) {
      if (json.length > 0) {
        return json;
      }
    }
    return false;
  }
};

const parseJSON = json => {
  try {
    return JSON.parse(json);
  } catch (e) {
    if (Array.isArray(json)) {
      return json;
    }
    return false;
  }
};

const hasWhiteSpace = string => {
  return /\s/g.test(string);
};

export { isContractArgValid, parseJSON, parseABI, getType, hasWhiteSpace };
