import { Contract } from 'ethers';

const RNS_REGISTRY_ADDRESS = '0xd25c3f94a743b93ecffecbe691beea51c3c2d9d1';
const REVERSE_REGISTER_ABI = [
  'function claim(address owner) public returns (bytes32 node)',
  'function setName(string memory name) public returns (bytes32 node)'
];

export default class ReverseRegistrar {
  constructor(signer) {
    const reverseRegisterContract = new Contract(
      RNS_REGISTRY_ADDRESS,
      REVERSE_REGISTER_ABI,
      signer
    );
    this.reverseRegisterContract = reverseRegisterContract;
    this.signer = signer;
  }

  async setReverseRecord(domain, addr) {
    const nonce = await this.signer.getTransactionCount();

    /** Set name call */
    const setNameResp = await this.reverseRegisterContract.setName(domain, {
      nonce: nonce
    });
    await setNameResp.wait();
    return await this.reverseRegisterContract.claim(addr.toLowerCase(), {
      nonce: nonce + 1
    });
  }
}
