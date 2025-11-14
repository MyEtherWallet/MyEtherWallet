import * as bitcoinLib from 'bitcoinjs-message';
import { verifyMessage as EvmVerifyMessage } from 'viem';

// TODO: Add DOT and SOL verify message implementations
const signer = {
  BITCOIN: ({ message, address, signature }: { message: string; address: string; signature: string }) => {
    return Promise.resolve(bitcoinLib.verify(message, address, signature))
  },
  EVM: EvmVerifyMessage,
}

export default signer