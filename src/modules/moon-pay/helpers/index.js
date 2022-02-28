import crypto from 'crypto';
import { isObject } from 'lodash';
import { sha3 } from 'web3-utils';

const ENCRYPTION_TYPE = 'aes-256-cbc';
const MOONPAY_EVENT = 'openMoonPay';
const MOONPAY_OFFER_END = new Date('3/2/22 12:00 am');
const LOCALE = {
  USD: 'en-US',
  EUR: 'es-ES',
  JPY: 'ja-JP',
  AUD: 'en-AU',
  CAD: 'en-CA',
  GBP: 'en-GB'
};
const decrypt = (value, id, address) => {
  // convert value to string
  const valueBuffer = Buffer.from(value, 'hex');

  // generate iv using first half of sha3 of address
  const iv = Buffer.from(
    sha3(address.toLowerCase()).replace('0x', '').substring(0, 32),
    'hex'
  );

  // generate key using sha3 of id
  const key = Buffer.from(sha3(id.toLowerCase()).replace('0x', ''), 'hex');

  // create decipher and decrypt value
  const decipher = crypto.createDecipheriv(ENCRYPTION_TYPE, key, iv);
  const decryptedValue = decipher.update(valueBuffer);
  const decryptedBuffer = Buffer.concat([decryptedValue, decipher.final()]);
  const decryptedString = decryptedBuffer.toString();

  try {
    const decryptedObject = JSON.parse(decryptedString);
    return decryptedObject;
  } catch (e) {
    return decryptedString;
  }
};

const encrypt = (value, id, address) => {
  // convert value to string
  const valueString = isObject(value) ? JSON.stringify(value) : value;

  // generate iv using first half of sha3 of address

  // generate iv using first half of sha3 of address
  const iv = Buffer.from(
    sha3(address.toLowerCase()).replace('0x', '').substring(0, 32),
    'hex'
  );

  // generate key using sha3 of id
  const key = Buffer.from(sha3(id.toLowerCase()).replace('0x', ''), 'hex');

  // create cipher and encrypt value
  const cipher = crypto.createCipheriv(ENCRYPTION_TYPE, key, iv);
  const encryptedValue = cipher.update(valueString);
  const encryptedBuffer = Buffer.concat([encryptedValue, cipher.final()]);
  const encryptedString = encryptedBuffer.toString();

  return encryptedString;
};

export { encrypt, decrypt, LOCALE, MOONPAY_EVENT, MOONPAY_OFFER_END };
