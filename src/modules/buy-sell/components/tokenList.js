import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common.js';

const tokenContracts = {
  eth: MAIN_TOKEN_ADDRESS,
  dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  pyusd: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
  // tusd: '0x0000000000085d4780B73119b644AE5ecd22b376',
  // fdusdsc: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
  // usdcsc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  // usdtsc: '0x55d398326f99059ff775485246999027b3197955',
  usdcmatic: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  usdtmatic: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  usdtarbitrum: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  usdtop: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58'
};

const sellContracts = [
  tokenContracts['eth'],
  tokenContracts['usdt'],
  tokenContracts['usdc']
];
const buyContracts = {
  ETH: [
    tokenContracts.eth,
    tokenContracts.usdt,
    tokenContracts.usdc,
    tokenContracts.dai,
    tokenContracts.pyusd
    // tokenContracts.tusd
  ],
  // BNB: [tokenContracts.fdusdsc, tokenContracts.usdcsc, tokenContracts.usdtsc],
  MATIC: [
    tokenContracts.eth,
    tokenContracts.usdcmatic,
    tokenContracts.usdtmatic
  ],
  ARB: [tokenContracts.usdtarbitrum],
  OP: [tokenContracts.usdtop]
};

const coingeckoContracts = {
  ETH: [
    'ethereum',
    'dai',
    'tether',
    'usd-coin',
    'paypal-usd' //'true-usd'
  ],
  // BNB: [
  //   'first-digital-usd',
  //   'binance-bridged-usdc-bnb-smart-chain',
  //   'binance-bridged-usdt-bnb-smart-chain'
  // ],
  MATIC: [
    'matic-network',
    'bridged-usdc-polygon-pos-bridge',
    'polygon-bridged-usdt-polygon'
  ],
  ARB: ['arbitrum-bridged-usdt-arbitrum'],
  OP: ['bridged-usdt']
};

export { buyContracts, sellContracts, coingeckoContracts };
