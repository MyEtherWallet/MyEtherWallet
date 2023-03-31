import { Contract, Wallet } from 'ethers';

const RNS_REGISTRY_ADDRESS = '0xd25c3f94a743b93ecffecbe691beea51c3c2d9d1';
const REVERSE_REGISTER_ABI = [
  'function claim(address owner) public returns (bytes32 node)',
  'function setName(string memory name) public returns (bytes32 node)'
];

export default class ReverseRegistrar {
  constructor(wallet, provider) {
    const signer = new Wallet(wallet.privateKey, provider);
    const reverseRegisterContract = new Contract(
      RNS_REGISTRY_ADDRESS,
      REVERSE_REGISTER_ABI,
      signer
    );
    this.reverseRegisterContract = reverseRegisterContract;
    this.signer = signer;
  }

  async setReverseRecord(domain, addr) {
    let resolved = false;
    let attempts = 0;
    while (!resolved && attempts < 5) {
      try {
        let nonce = await this.signer.getTransactionCount(RNS_REGISTRY_ADDRESS);
        const setNameResp = await this.reverseRegisterContract.setName(domain, {
          nonce: nonce + attempts
        });
        await setNameResp.wait();
        nonce = await this.signer.getTransactionCount(RNS_REGISTRY_ADDRESS);
        await this.reverseRegisterContract.claim(addr.toLowerCase(), {
          nonce: nonce + attempts
        });
        resolved = true;
      } catch (e) {
        resolved = false;
      }
      attempts++;
    }
  }
}
