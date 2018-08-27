// eslint-disable-next-line no-unused-vars
class Signer {
  constructor() {}

  /**
   * Computes a sha3-256 hash of the serialized tx
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   */
  hash(includeSignature) {
    if (includeSignature === undefined) includeSignature = true;

    // EIP155 spec:
    // when computing the hash of a transaction for purposes of signing or recovering,
    // instead of hashing only the first six elements (ie. nonce, gasprice, startgas, to, value, data),
    // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0

    let items;
    if (includeSignature) {
      items = this.raw;
    } else {
      if (this._chainId > 0) {
        const raw = this.raw.slice();
        this.v = this._chainId;
        this.r = 0;
        this.s = 0;
        items = this.raw;
        this.raw = raw;
      } else {
        items = this.raw.slice(0, 6);
      }
    }

    // create hash
    // eslint-disable-next-line no-undef
    return ethUtil.rlphash(items);
  }
}
