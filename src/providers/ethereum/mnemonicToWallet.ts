import { mnemonicToSeed } from 'bip39'
import HDkey from 'hdkey'
import PrivateKeyWallet from './privateKeyWallet'

class MnemonicToWallet {
  mnemonic: string
  basePath: string
  chainId: string
  constructor(options: {
    mnemonic: string
    basePath: string
    chainId: string
  }) {
    this.mnemonic = options.mnemonic
    this.basePath = options.basePath
    this.chainId = options.chainId
  }
  async getWallet(index: number): Promise<PrivateKeyWallet> {
    const seed = await mnemonicToSeed(this.mnemonic)
    const hdkey = HDkey.fromMasterSeed(seed)
    const derived = hdkey.derive(`${this.basePath}${index}`)
    return new PrivateKeyWallet(derived.privateKey!, this.chainId)
  }
}

export default MnemonicToWallet
