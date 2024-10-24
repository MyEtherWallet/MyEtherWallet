import MEWPClass from './mew-provider-class';
import { ETH, BSC, POL } from '@/utils/networks/types';
class ParaSwap {
  constructor(web3, chain) {
    return new MEWPClass(
      MEWPClass.supportedDexes.PARASWAP,
      web3,
      [ETH.name, BSC.name, POL.name],
      chain
    );
  }
}
export default ParaSwap;
