import * as bitcoinLib from 'bitcoinjs-message';
import { verifyMessage as EvmVerifyMessage } from 'viem';

// TODO: Add DOT and SOL verify message implementations
const signer = {
  BITCOIN: bitcoinLib.verify,
  EVM: EvmVerifyMessage,
}

export default signer