import {
  eth,
  etcLegacy,
  ltc,
  btc,
  doge,
  mona,
  rbtc,
  xrp,
  bch
} from '@ensdomains/address-encoder/coins';
import MultiCoinValidator from 'multicoin-address-validator';
class MValidator {
  constructor(type) {
    this.type = type;
  }
  validate(address) {
    if (!address) return false;
    return MultiCoinValidator.validate(address, this.type);
  }
}

export default {
  ETH: {
    id: 60,
    symbol: 'ETH',
    name: 'Ethereum',
    validator: new MValidator('Ethereum'),
    encode: eth.encode,
    decode: eth.decode
  },
  ETC: {
    id: 61,
    symbol: 'ETC',
    name: 'Ethereum Classic',
    validator: new MValidator('EthereumClassic'),
    encode: etcLegacy.encode,
    decode: etcLegacy.decode
  },
  LTC: {
    id: 2,
    symbol: 'LTC',
    name: 'Litecoin',
    validator: new MValidator('LiteCoin'),
    encode: ltc.encode,
    decode: ltc.decode
  },
  BTC: {
    id: 0,
    symbol: 'BTC',
    name: 'Bitcoin',
    validator: new MValidator('Bitcoin'),
    encode: btc.encode,
    decode: btc.decode
  },
  DOGE: {
    id: 3,
    symbol: 'DOGE',
    name: 'DogeCoin',
    validator: new MValidator('DogeCoin'),
    encode: doge.encode,
    decode: doge.decode
  },
  MONA: {
    id: 22,
    symbol: 'MONA',
    name: 'MonaCoin',
    validator: new MValidator('MonaCoin'),
    encode: mona.encode,
    decode: mona.decode
  },
  RSK: {
    id: 137,
    symbol: 'RSK',
    name: 'RootStock',
    validator: new MValidator('Ethereum'),
    encode: rbtc.encode,
    decode: rbtc.decode
  },
  XRP: {
    id: 144,
    symbol: 'XRP',
    name: 'Ripple',
    validator: new MValidator('Ripple'),
    encode: xrp.encode,
    decode: xrp.decode
  },
  BCH: {
    id: 145,
    symbol: 'BCH',
    name: 'BitcoinCash',
    validator: new MValidator('BitcoinCash'),
    encode: bch.encode,
    decode: bch.decode
  }
};
