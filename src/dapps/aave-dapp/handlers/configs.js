const COLORS = {
  ENJ: 'bluePrimary',
  ETH: 'greenPrimary',
  ZRX: 'greenMedium',
  KNC: 'textDark',
  USDT: 'redPrimary',
  MKR: 'redPrimary',
  LEND: 'redPrimary',
  AAVE: 'textLight',
  DAI: 'textLight',
  SUSD: 'greyPrimary',
  LINK: 'greyMedium',
  BUSD: 'greyMedium',
  REN: 'greenPrimary',
  WBTC: 'greyMedium',
  UNI: 'redMedium',
  REP: 'greyLight',
  MANA: 'greyLight',
  BAT: 'greyLight',
  YFI: 'white',
  TUSD: 'black'
};

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

const LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const REPAY_WITH_COLLATERAL_ADAPTER =
  '0x80Aca0C645fEdABaa20fd2Bf0Daf57885A309FE6';
const SWAP_COLLATERAL_ADAPTER = '0x135896DE8421be2ec868E0b811006171D9df802A';
const WETH_GATEWAY = '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04';
const PRICE_ORACLE = '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9';

export default {
  COLORS,
  STABLE_COINS,
  LENDING_POOL,
  REPAY_WITH_COLLATERAL_ADAPTER,
  SWAP_COLLATERAL_ADAPTER,
  WETH_GATEWAY,
  PRICE_ORACLE
};
