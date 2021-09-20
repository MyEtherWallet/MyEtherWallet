import MEWPClass from './mew-provider-class';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
class ParaSwap {
  constructor(web3, chain) {
    return new MEWPClass(
      MEWPClass.supportedDexes.PARASWAP,
      web3,
      [ETH.name, BSC.name, MATIC.name],
      chain
    );
  }
}
export default ParaSwap;
