import { formatsByName } from '@ensdomains/address-encoder';
import MultiCoinValidator from 'multicoin-address-validator';
import { isValidChecksumAddress as isValidRSKChecksumAddress } from 'rskjs-util';
import { RSK } from '@/networks/types';

class MValidator {
  constructor(type) {
    this.type = type;
  }
  validate(address) {
    return MultiCoinValidator.validate(address, this.type);
  }
}
class RSKValidator {
  constructor(chainID) {
    this.chainID = chainID;
  }
  validate(address) {
    return isValidRSKChecksumAddress(address, this.chainID);
  }
}
export default {
  ETH: {
    id: 60,
    symbol: 'ETH',
    name: 'Ethereum',
    validator: new MValidator('Ethereum'),
    encode: formatsByName['ETH'].encoder,
    decode: formatsByName['ETH'].decoder
  },
  ETC: {
    id: 61,
    symbol: 'ETC',
    name: 'Ethereum Classic',
    validator: new MValidator('EthereumClassic'),
    encode: formatsByName['ETC'].encoder,
    decode: formatsByName['ETC'].decoder
  },
  LTC: {
    id: 2,
    symbol: 'LTC',
    name: 'Litecoin',
    validator: new MValidator('LiteCoin'),
    encode: formatsByName['LTC'].encoder,
    decode: formatsByName['LTC'].decoder
  },
  BTC: {
    id: 0,
    symbol: 'BTC',
    name: 'Bitcoin',
    validator: new MValidator('Bitcoin'),
    encode: formatsByName['BTC'].encoder,
    decode: formatsByName['BTC'].decoder
  },
  DOGE: {
    id: 3,
    symbol: 'DOGE',
    name: 'DogeCoin',
    validator: new MValidator('DogeCoin'),
    encode: formatsByName['DOGE'].encoder,
    decode: formatsByName['DOGE'].decoder
  },
  MONA: {
    id: 22,
    symbol: 'MONA',
    name: 'MonaCoin',
    validator: new MValidator('MonaCoin'),
    encode: formatsByName['MONA'].encoder,
    decode: formatsByName['MONA'].decoder
  },
  RSK: {
    id: 137,
    symbol: 'RSK',
    name: 'RootStock',
    validator: new RSKValidator(RSK.chainID),
    encode: formatsByName['RSK'].encoder,
    decode: formatsByName['RSK'].decoder
  },
  XRP: {
    id: 144,
    symbol: 'XRP',
    name: 'Ripple',
    validator: new MValidator('Ripple'),
    encode: formatsByName['XRP'].encoder,
    decode: formatsByName['XRP'].decoder
  },
  BCH: {
    id: 145,
    symbol: 'BCH',
    name: 'BitcoinCash',
    validator: new MValidator('BitcoinCash'),
    encode: formatsByName['BCH'].encoder,
    decode: formatsByName['BCH'].decoder
  }
};
