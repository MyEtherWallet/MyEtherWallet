import type { LimitOrderV4Struct } from '@1inch/fusion-sdk'
import i18n from '@/i18n'

// Kept apart from `oneInchFusion.ts` so callers can reference these without
// pulling the 1inch SDK into their chunk (the provider itself is lazy-loaded).

export interface SubmitOrderResult {
  hash: string
  /** Escrow deposit transaction, only present for native (ETH/BNB) orders. */
  depositTxHash?: string
}

export interface SubmitOrderHooks {
  /**
   * Fired as soon as the native deposit transaction has been broadcast, i.e.
   * the wallet prompt is over. Lets the UI drop its "confirm in wallet" copy.
   */
  onDepositSent?: (txHash: string) => void
}

/** The parameters needed to cancel a funded native order and reclaim the ETH. */
export interface NativeOrderRecoveryParams {
  /** The per-order proxy the deposit was sent to (the order's `maker`). */
  proxyAddress: string
  /** The order as built by the SDK, with the proxy as `maker`. */
  nativeOrder: LimitOrderV4Struct
  /** The user's address, the real maker behind the proxy. */
  fromAddress: string
}

/**
 * Thrown when the native deposit was broadcast but 1inch's relayer refused the
 * order afterwards (after retries). The ETH is then sitting in the order's
 * proxy with no order to fill it, so the caller must persist these details and
 * offer the user a way to reclaim the funds (`cancelNativeOrder`).
 */
export class NativeOrderUnsubmittedError extends Error {
  readonly orderHash: string
  readonly depositTxHash: string
  readonly proxyAddress: string
  readonly nativeOrder: LimitOrderV4Struct
  readonly cause: unknown

  constructor(params: {
    orderHash: string
    depositTxHash: string
    proxyAddress: string
    nativeOrder: LimitOrderV4Struct
    cause: unknown
  }) {
    super(i18n.global.t('trade.error.order-unsubmitted'))
    this.name = 'NativeOrderUnsubmittedError'
    this.orderHash = params.orderHash
    this.depositTxHash = params.depositTxHash
    this.proxyAddress = params.proxyAddress
    this.nativeOrder = params.nativeOrder
    this.cause = params.cause
  }
}
