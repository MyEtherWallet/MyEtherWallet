import MEWPClass from './mew-provider-class';
class DexAg {
  constructor(web3) {
    return new MEWPClass(MEWPClass.supportedDexes.DEX_AG, web3);
  }
}
export default DexAg;
