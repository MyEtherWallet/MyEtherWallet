import MEWPClass from './mew-provider-class';
import paraswap from '../../assets/logo-only/paraswap-logo.png';
import oneinch from '../../assets/logo-only/1inch-logo.png';
import zerox from '../../assets/logo-only/0x-logo.png';
import changelly from '../../assets/logo-only/changelly-logo.png';

export default {
  [MEWPClass.supportedDexes.PARASWAP]: {
    title: 'ParaSwap terms',
    termsUrl: 'https://www.velora.xyz/terms/terms-of-use',
    logo: paraswap,
    name: 'ParaSwap'
  },
  [MEWPClass.supportedDexes.ONE_INCH]: {
    title: '1inch terms',
    termsUrl: 'https://1inch.com/assets/1inch_com_privacy_policy.pdf',
    logo: oneinch,
    name: '1inch'
  },
  [MEWPClass.supportedDexes.ZERO_X]: {
    title: '0x terms',
    termsUrl: 'https://0x.org/legal/api-license-agreement',
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
