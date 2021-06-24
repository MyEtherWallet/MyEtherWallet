import MEWPClass from './mew-provider-class';
import { ETH } from '@/utils/networks/types';
class DexAg {
  constructor(web3, chain) {
    return new MEWPClass(
      MEWPClass.supportedDexes.DEX_AG,
      web3,
      [ETH.name],
      chain
    );
  }
}
export default DexAg;
