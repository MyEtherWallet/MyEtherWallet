import MEWPClass from './mew-provider-class';
import { ETH, BSC, POL } from '@/utils/networks/types';
class OneInch {
  constructor(web3, chain) {
    return new MEWPClass(
      MEWPClass.supportedDexes.ONE_INCH,
      web3,
      [ETH.name, BSC.name, POL.name],
      chain
    );
  }
}
export default OneInch;
