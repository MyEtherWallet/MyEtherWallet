/**
 * Which wallet request a sign modal is waiting on (MEW-2694).
 *
 * A wallet prompt — a hardware device, a phone over WalletConnect, a browser
 * extension — can stay open long after the modal that asked for it is closed.
 * Closing the modal abandons that request: the modal reopens clean, and the
 * code still awaiting the old reply drops it. A signature that arrives late is
 * never broadcast, submitted, saved or shown.
 */
export interface SignSession {
  /**
   * Starts a request, abandoning the one before it. The returned check turns
   * true once this request is abandoned; read it after every await.
   */
  start: () => () => boolean
  /** Abandons the request in flight, if there is one. */
  abandon: () => void
}

export const createSignSession = (): SignSession => {
  let current = 0
  return {
    start: () => {
      const id = ++current
      return () => id !== current
    },
    abandon: () => {
      current++
    },
  }
}

/**
 * Thrown by code that signs and then sends in one call, in place of sending a
 * signature whose request was abandoned while the wallet held it.
 */
export class AbandonedSignError extends Error {
  constructor() {
    super('The request was closed before the wallet answered')
    this.name = 'AbandonedSignError'
  }
}
