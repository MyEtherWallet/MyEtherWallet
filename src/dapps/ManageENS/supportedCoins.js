import bs58 from 'bs58';
import { utils } from 'web3';
const base58encode = bytes => {
  return bs58.encode(Buffer.from(bytes.replace('0x', ''), 'hex'));
};
const base58decode = addr => {
  return '0x' + bs58.decode(addr).toString('hex');
};
const ethEncode = bytes => {
  return utils.toHex(bytes);
};
const ethDecode = addr => {
  if (addr === '') return '0x';
  return addr;
};
export default {
  ETH: {
    id: 60,
    symbol: 'ETH',
    name: 'Ethereum',
    validator: 'Ethereum',
    encode: ethEncode,
    decode: ethDecode
  },
  ETC: {
    id: 61,
    symbol: 'ETC',
    name: 'Ethereum Classic',
    validator: 'EthereumClassic',
    encode: ethEncode,
    decode: ethDecode
  },
  LTC: {
    id: 2,
    symbol: 'LTC',
    name: 'Litecoin',
    validator: 'LiteCoin',
    encode: base58encode,
    decode: base58decode
  },
  BTC: {
    id: 0,
    symbol: 'BTC',
    name: 'Bitcoin',
    validator: 'Bitcoin',
    encode: base58encode,
    decode: base58decode
  }
};
