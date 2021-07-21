import { ETH, BSC, MATIC } from '@/utils/networks/types';

const TRENDING_LIST = {
  [ETH.name]: [
    {
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      isEth: true
    },
    {
      contract: '0xbtc',
      decimals: 18,
      img: 'https://img.mewapi.io/?image=https://web-api.changelly.com/api/coins/btc.png',
      symbol: 'BTC',
      isEth: false,
      name: 'BTC',
      subtext: 'Bitcoin',
      value: 'Bitcoin',
      cgid: 'bitcoin'
    },
    {
      contract: '0xc713e5e149d5d0715dcd1c156a020976e7e56b88',
      isEth: true
    },
    {
      contract: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      isEth: true
    },
    {
      contract: '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202',
      isEth: true
    }
  ],
  [BSC.name]: [],
  [MATIC.name]: []
};

export { TRENDING_LIST };
