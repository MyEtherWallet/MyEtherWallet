import MEWPClass from './mew-provider-class';
class OneInch {
  constructor(web3) {
    return new MEWPClass(MEWPClass.supportedDexes.ONE_INCH, web3);
  }
}
export default OneInch;
