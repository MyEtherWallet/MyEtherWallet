import xblaster from '@/modules/swap/assets/xblaster.png';
import uniswap from '@/modules/swap/assets/uniswap.png';
import Bancor from '@/modules/swap/assets/Bancor.png';
import kyber from '@/modules/swap/assets/kyber.png';
import ZeroX from '@/modules/swap/assets/0x.png';
import Oasis from '@/modules/swap/assets/Oasis.png';
import Synthetix from '@/modules/swap/assets/Synthetix.png';
import Curve from '@/modules/swap/assets/Curve.png';
import Sushiswap from '@/modules/swap/assets/Sushiswap.png';
import OneInch from '@/modules/swap/assets/1inch.png';
import Changelly from '@/modules/swap/assets/Changelly.png';
import iconSwap from '@/assets/images/icons/icon-swap.svg';
export default {
  status: {
    SUBMITTED: 'SUBMITTED',
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    UNKNOWN: 'UNKNOWN'
  },
  ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  exchangeInfo: {
    ag: {
      name: 'X Blaster',
      description: '',
      img: xblaster
    },
    balancer: {
      name: 'Balancer',
      description: '',
      img: ''
    },
    compound: {
      name: 'Compound',
      description: '',
      img: ''
    },
    uniswap: {
      name: 'Uniswap',
      description: '',
      img: uniswap
    },
    uniswap_v2: {
      name: 'Uniswap v2',
      description: '',
      img: uniswap
    },
    uniswap_v3: {
      name: 'Uniswap v3',
      description: '',
      img: uniswap
    },
    bancor: {
      name: 'Bancor',
      description: '',
      img: Bancor
    },
    kyber: {
      name: 'Kyber Swap',
      description: '',
      img: kyber
    },
    zero_x: {
      name: '0x',
      description: '',
      img: ZeroX
    },
    zero_x_v2: {
      name: '0x v2',
      description: '',
      img: ZeroX
    },
    zero_x_v3: {
      name: '0x v3',
      description: '',
      img: ZeroX
    },
    oasis: {
      name: 'Oasis',
      description: '',
      img: Oasis
    },
    synthetix: {
      name: 'Synthetix',
      description: '',
      img: Synthetix
    },
    curvefi: {
      name: 'Curve fi',
      description: '',
      img: Curve
    },
    curve_susd: {
      name: 'Curve sUSD',
      description: '',
      img: Curve
    },
    sushiswap: {
      name: 'Sushiswap',
      description: '',
      img: Sushiswap
    },
    one_inch: {
      name: 'One Inch',
      description: '',
      img: OneInch
    },
    changelly: {
      name: 'Changelly',
      description: '',
      img: Changelly
    },
    default: {
      name: '',
      description: '',
      img: iconSwap
    }
  }
};
