const kyberAddressFallback = {
  ETH: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
  ROP: '0x818E6FECD516Ecc3849DAf6845e3EC868087B755'
};

import { KyberCurrenciesETH } from './currenciesETH';
import { KyberCurrenciesROP } from './currenciesROP';

const KyberCurrencies = { ETH: KyberCurrenciesETH, ROP: KyberCurrenciesROP };

export { KyberCurrencies, kyberAddressFallback };
