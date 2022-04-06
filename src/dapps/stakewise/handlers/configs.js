const IMAGE_PROXY = 'https://img.mewapi.io/?image=';
const SETH2_MAINNET_CONTRACT = '0xfe2e637202056d30016725477c5da089ab0a043a';
const RETH2_MAINNET_CONTRACT = '0x20bc832ca081b91433ff6c17f85701b6e92486c5';
const POOL_MAINNET_CONTRACT = '0xC874b064f465bdD6411D45734b56fac750Cda29A';
const SETH2_GOERLI_CONTRACT = '0x221D9812823DBAb0F1fB40b0D294D9875980Ac19';
const RETH2_GOERLI_CONTRACT = '0x826f88d423440c305D9096cC1581Ae751eFCAfB0';
const POOL_GOERLI_CONTRACT = '0x8c1EfEcFb5c4F1099AB0460b5659342943764Df7';
const MEW_REFERRAL_ADDRESS = '0xeafbdfca5d8346f409b7c322c77692f89d061c78';
const POOL_API = 'https://api.stakewise.io/pool-stats';

const ETH_Token = {
  contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  decimals: 18,
  img: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
  name: 'ETH',
  symbol: 'ETH',
  value: 'Ethereum'
};

const SETH2_Token = {
  contract: SETH2_MAINNET_CONTRACT,
  decimals: 18,
  img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/SETH2-0xFe2e637202056d30016725477c5da089Ab0A043A.png',
  name: 'sETH2',
  symbol: 'SETH2',
  value: 'sETH2'
};

const RETH2_Token = {
  contract: RETH2_MAINNET_CONTRACT,
  decimals: 18,
  img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/rETH2-0x20BC832ca081b91433ff6c17f85701B6e92486c5.png',
  name: 'rETH2',
  symbol: 'rETH2',
  value: 'rETH2'
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
  MEW_REFERRAL_ADDRESS,
  SETH2_Token,
  RETH2_Token,
  ETH_Token
};
