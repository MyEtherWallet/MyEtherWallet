const TRENDING_SYMBOLS = ['ETH', 'BTC', 'aMKR', 'ZRX', 'KNC'];

const TRENDING_LIST = [
  {
    contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    img: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    symbol: 'ETH',
    isEth: true,
    name: 'ETH',
    subtext: 'Ethereum',
    type: 'ERC20',
    value: 'Ethereum',
    id: 'ethereum'
  },
  {
    contract_address: '0xbtc',
    decimals: 18,
    img: 'https://img.mewapi.io/?image=https://web-api.changelly.com/api/coins/btc.png',
    symbol: 'BTC',
    isEth: false,
    name: 'BTC',
    subtext: 'Bitcoin',
    value: 'Bitcoin',
    id: 'bitcoin'
  },
  {
    contract_address: '0xc713e5e149d5d0715dcd1c156a020976e7e56b88',
    decimals: 18,
    symbol: 'aMKR',
    isEth: true,
    name: 'aMKR',
    subtext: 'Aave MKR',
    type: 'ERC20',
    value: 'Aave MKR'
  },
  {
    contract_address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    symbol: 'ZRX',
    decimals: 18,
    isEth: true,
    name: 'ZRX',
    subtext: '0x',
    type: 'ERC20',
    value: '0x'
  },
  {
    contract_address: '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
    symbol: 'KNC',
    decimals: 18,
    isEth: true,
    name: 'KNC',
    subtext: 'Kyber Network Crystal',
    type: 'ERC20',
    value: 'Kyber Network Crystal'
  }
];

export { TRENDING_SYMBOLS, TRENDING_LIST };
