import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common.js';

const tokenContracts = {
  eth: MAIN_TOKEN_ADDRESS,
  matic: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  bnb: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
};

const sellContracts = [
  tokenContracts['eth'],
  tokenContracts['usdt'],
  tokenContracts['usdc']
];
const buyContracts = [
  tokenContracts.eth,
  tokenContracts.matic,
  tokenContracts.bnb,
  tokenContracts.usdt,
  tokenContracts.usdc
];

export { buyContracts, sellContracts };
