import MEWPClass from './mew-provider-class';
import paraswap from '../../assets/paraswap.png';
import oneinch from '../../assets/1inch.png';
import zerox from '../../assets/0x.png';
import changelly from '../../assets/Changelly.png';

export default {
  [MEWPClass.supportedDexes.PARASWAP]: {
    title: "ParaSwap's terms",
    termsUrl: 'https://paraswap.io/',
    logo: paraswap,
    name: 'Paraswap'
  },
  [MEWPClass.supportedDexes.ONE_INCH]: {
    title: "1inch's terms",
    termsUrl: 'https://1inch.io/',
    logo: oneinch,
    name: '1Inch'
  },
  [MEWPClass.supportedDexes.ZERO_X]: {
    title: "0x's terms",
    termsUrl: 'https://0x.org/',
    logo: zerox,
    name: '0x'
  },
  changelly: {
    title: 'the Changelly AML/KYC',
    termsUrl: 'https://changelly.com/aml-kyc',
    logo: changelly,
    name: 'Changelly'
  }
};
