import MEWPClass from './mew-provider-class';
class OneInch {
  constructor(web3) {
    return new MEWPClass('ONE_INCH', web3);
  }
}
export default OneInch;
