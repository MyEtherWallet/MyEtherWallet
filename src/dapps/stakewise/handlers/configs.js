const IMAGE_PROXY = 'https://img.mewapi.io/?image=';
const SETH2_MAINNET_CONTRACT = '0xfe2e637202056d30016725477c5da089ab0a043a';
const RETH2_MAINNET_CONTRACT = '0x20bc832ca081b91433ff6c17f85701b6e92486c5';
const POOL_MAINNET_CONTRACT = '0xC874b064f465bdD6411D45734b56fac750Cda29A';
const SETH2_GOERLI_CONTRACT = '0x221D9812823DBAb0F1fB40b0D294D9875980Ac19';
const RETH2_GOERLI_CONTRACT = '0x826f88d423440c305D9096cC1581Ae751eFCAfB0';
const POOL_GOERLI_CONTRACT = '0x8c1EfEcFb5c4F1099AB0460b5659342943764Df7';
const MEW_GOERLI_CONTRACT = '0xf65979689cbc4ec97bacdaa6adce46266be3ad60';
const POOL_API = 'https://api.stakewise.io/pool-stats';

const SETH2_Token = {
  balance: '0x00', // don't know what the default for this is
  balancef: '0.000000',
  contract: SETH2_MAINNET_CONTRACT,
  decimals: 18,
  img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SETH2-0xFe2e637202056d30016725477c5da089Ab0A043A.png',
  market_cap: '0',
  market_capf: '0',
  name: 'sETH2',
  price: '0',
  price_change_percentage_24h: '0',
  price_change_percentage_24hf: '0',
  pricef: '0',
  subtext: 'sETH2',
  symbol: 'SETH2',
  usdBalance: '0',
  usdBalancef: '0.00',
  value: 'sETH2'
};

export {
  IMAGE_PROXY,
  SETH2_MAINNET_CONTRACT,
  RETH2_MAINNET_CONTRACT,
  POOL_API,
  POOL_MAINNET_CONTRACT,
  SETH2_GOERLI_CONTRACT,
  RETH2_GOERLI_CONTRACT,
  POOL_GOERLI_CONTRACT,
  MEW_GOERLI_CONTRACT,
  SETH2_Token
};
