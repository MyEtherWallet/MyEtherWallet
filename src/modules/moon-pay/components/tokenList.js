const tokensList = [
  {
    decimals: 18,
    img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
    name: 'ETH',
    subtext: 'Ethereum',
    value: 'Ethereum',
    symbol: 'ETH',
    network: 'ETH'
  },
  {
    decimals: 18,
    img: 'https://img.mewapi.io/?image=https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    name: 'MATIC',
    subtext: 'Polygon',
    value: 'Polygon (Matic)',
    symbol: 'MATIC (Matic)',
    network: 'MATIC'
  },
  {
    decimals: 18,
    img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/BNB-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    name: 'BNB',
    subtext: 'Binance Smart Chain',
    value: 'Binance Smart Chain',
    symbol: 'BNB (BSC/BEP20)',
    network: 'BSC'
  },
  {
    decimals: 6,
    img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7-eth.png',
    name: 'USDT',
    subtext: 'Tether',
    value: 'Tether',
    symbol: 'USDT (ERC20)',
    network: 'ETH'
  },
  {
    decimals: 6,
    img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48-eth.svg',
    name: 'USDC',
    subtext: 'USD Coin',
    value: 'USD Coin',
    symbol: 'USDC (ERC20)',
    network: 'ETH'
  }
];

const tokenIds = [
  'ethereum',
  'matic-network',
  'binancecoin',
  'tether',
  'usd-coin'
];

export { tokensList, tokenIds };
