import Eth from "web3-eth";
import { type EvmTransactionAction } from "@/mew_api/types"

const ACTIONS: Record<string, EvmTransactionAction> = {
  approval: 'TOKEN_APPROVAL',
  swap: 'TOKEN_SWAP',
  transfer: 'TOKEN_TRANSFER',
}

const signatures = {
  '0x095ea7b3': ({ data }: { data: string; from?: string; to?: string; value?: string | number }): EvmTransactionAction => {
    const params = new Eth().abi.decodeParameters(
      ['address', 'uint256'],
      data.slice(10),
    );

    const value = BigInt(params[1]);
    if (value <= 0n) return ACTIONS.approval;
    return ACTIONS.approval;
  },
  // ERC20 transfer(address,uint256)
  '0xa9059cbb': () => {
    return ACTIONS.transfer
  },
  // ERC20 transferFrom(address,address,uint256)
  '0x23b872dd': () => {
    return ACTIONS.transfer
  },
  '0x876a02f6': () => { // ETH -> token
    return ACTIONS.swap
  },
  '0x07ed2379': () => { // token -> token
    return ACTIONS.transfer
  },
  '0x2213bc0b': () => { // 0x execute function, consider as a token transfer
    return ACTIONS.swap
  },
  '0xe8bb3b6c': () => { // paraswap SwapExactAmountInOnUniswapv2 function 
    return ACTIONS.swap
  },
  '0xe3ead59e': () => { // paraswap SwapExactAmountIn function
    return ACTIONS.swap
  }
}

const getSignature = (data: string) => data.slice(0, 10);

type SignatureKey = keyof typeof signatures;

export default (
  tx: { data?: string; from?: string; to?: string; value?: string | number }
) => {
  if (!tx.data || tx.data === '0x') return ACTIONS.swap;
  const sig = getSignature(tx.data) as SignatureKey;
  if (!signatures[sig]) {
    return '';
  }
  return signatures[sig]({
    data: tx.data,
    from: tx.from,
    to: tx.to,
    value: tx.value,
  });
}