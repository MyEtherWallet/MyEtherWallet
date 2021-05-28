const TRENDING_SYMBOLS = ['ETH', 'BTC', 'aMKR', 'ZRX', 'KNC'];

const trendingList = [
  {
    contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    img: 'https://img.mewapi.io/?image=https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/icons/ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.svg',
    isEth: true,
    name: 'Ethereum',
    subtext: 'ETH',
    symbol: 'ETH',
    type: 'ERC20',
    value: 'Ethereum'
  },
  {
    contract_address: '0xbtc',
    decimals: 18,
    img: 'https://img.mewapi.io/?image=https://web-api.changelly.com/api/coins/btc.png',
    isEth: false,
    name: 'Bitcoin',
    subtext: 'BTC',
    symbol: 'BTC',
    value: 'Bitcoin'
  },
  {
    contract_address: '0xc713e5e149d5d0715dcd1c156a020976e7e56b88',
    decimals: 18,
    isEth: true,
    name: 'Aave MKR',
    subtext: 'aMKR',
    symbol: 'aMKR',
    type: 'ERC20',
    value: 'Aave MKR'
  },
  {
    contract_address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    decimals: 18,
    isEth: true,
    name: '0x',
    subtext: 'ZRX',
    symbol: 'ZRX',
    type: 'ERC20',
    value: '0x'
  },
  {
    contract_address: '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
    decimals: 18,
    isEth: true,
    name: 'Kyber Network Crystal',
    subtext: 'KNC',
    symbol: 'KNC',
    type: 'ERC20',
    value: 'Kyber Network Crystal'
  }
];

export { TRENDING_SYMBOLS, trendingList };
