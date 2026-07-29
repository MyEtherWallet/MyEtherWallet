import HWwallet from '@enkryptcom/hw-wallets'
import type { HWwalletType, NetworkNames } from '@enkryptcom/types'

type GetAddressOptions = Parameters<HWwallet['getAddress']>[0]
type GetAddressResult = Awaited<ReturnType<HWwallet['getAddress']>>
type IsConnectedOptions = Parameters<HWwallet['isConnected']>[0]

/**
 * A cached Trezor network provider as held in the underlying manager's public
 * `providers` map. `TrezorConnect` is left `undefined` when the process-wide
 * `TrezorConnect.init()` throws (e.g. "already initialized"). Calling
 * `getAddress` against such a provider is what produces the downstream
 * `TypeError: ...reading 'ethereumGetPublicKey'`.
 */
interface TrezorProviderLike {
  TrezorConnect?: unknown
}

/**
 * `@trezor/connect-web` is a process-wide singleton whose `init()` throws
 * `TrezorConnect has been already initialized` if it runs a second time. When it
 * does throw, the underlying library still caches the (now uninitialized)
 * provider, so a later `getAddress` dereferences `undefined`.
 */
export const isTrezorAlreadyInitializedError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return message.toLowerCase().includes('already initialized')
}

/**
 * App-level wrapper around `@enkryptcom/hw-wallets` for Trezor.
 *
 * The underlying manager calls the process-wide `TrezorConnect.init()` the first
 * time each network provider is initialized. Because the app used to create a
 * fresh manager on every connect attempt (and per chain/derivation change), a
 * second connect re-ran that global init and threw
 * `TrezorConnect has been already initialized` (Sentry APP-MEW-WEB-HV); the
 * poisoned, cached provider then made `getAddress` deref an undefined
 * `TrezorConnect` (Sentry APP-MEW-WEB-WH).
 *
 * This wrapper makes init idempotent and guards the getAddress path:
 *  - {@link init} memoizes initialization so it runs once (see also
 *    {@link getTrezorManager}, which keeps a single manager per session);
 *  - an "already initialized" error is treated as success;
 *  - {@link getAddress} recovers any provider left uninitialized before
 *    delegating, so it never dereferences an undefined `TrezorConnect`.
 */
export class TrezorManager extends HWwallet {
  private isInitialized = false
  private initPromise: Promise<boolean> | null = null

  /**
   * Idempotent, memoized initialization. The first call drives the underlying
   * manager's per-network init (which triggers the single process-wide
   * `TrezorConnect.init()`); subsequent calls are a no-op success. An
   * "already initialized" error is treated as success.
   */
  async init(
    wallet: HWwalletType,
    networkName: NetworkNames,
  ): Promise<boolean> {
    if (this.isInitialized) return true
    if (!this.initPromise) {
      this.initPromise = this.performInit(wallet, networkName).then(
        result => {
          this.isInitialized = true
          return result
        },
        error => {
          // Allow a retry after a genuine (non "already initialized") failure.
          this.initPromise = null
          throw error
        },
      )
    }
    return this.initPromise
  }

  private async performInit(
    wallet: HWwalletType,
    networkName: NetworkNames,
  ): Promise<boolean> {
    try {
      // `isConnected` drives the underlying manager's internal init for this
      // network, which is where `TrezorConnect.init()` is invoked.
      await super.isConnected({ wallet, networkName })
    } catch (error) {
      if (!isTrezorAlreadyInitializedError(error)) throw error
      // The global TrezorConnect is already up; recover any poisoned provider.
      this.recoverUninitializedProviders()
    }
    return true
  }

  override async isConnected(options: IsConnectedOptions): Promise<boolean> {
    try {
      return await super.isConnected(options)
    } catch (error) {
      if (isTrezorAlreadyInitializedError(error)) {
        this.recoverUninitializedProviders()
        return true
      }
      throw error
    }
  }

  override async getAddress(
    options: GetAddressOptions,
  ): Promise<GetAddressResult> {
    // Guard: ensure init ran once so we never reach `getAddress` before the
    // underlying `TrezorConnect` exists.
    if (!this.isInitialized) {
      await this.init(options.wallet, options.networkName)
    }
    // Guard: repair any provider whose init failed and left `TrezorConnect`
    // unset before delegating, so we never deref `undefined`.
    this.recoverUninitializedProviders()
    try {
      return await super.getAddress(options)
    } catch (error) {
      if (isTrezorAlreadyInitializedError(error)) {
        this.recoverUninitializedProviders()
        return super.getAddress(options)
      }
      throw error
    }
  }

  /**
   * Repairs providers whose init failed (their `TrezorConnect` is unset) by
   * reusing the already-initialized `TrezorConnect` from a healthy sibling
   * provider. When none exists, the poisoned entry is dropped so the next call
   * re-initializes it rather than dereferencing `undefined`.
   */
  private recoverUninitializedProviders(): void {
    const providers = this.providers as
      | Record<string, TrezorProviderLike | undefined>
      | undefined
    if (!providers) return
    const healthy = this.findInitializedTrezorConnect(providers)
    for (const key of Object.keys(providers)) {
      const provider = providers[key]
      if (provider && 'TrezorConnect' in provider && !provider.TrezorConnect) {
        if (healthy) {
          provider.TrezorConnect = healthy
        } else {
          delete providers[key]
        }
      }
    }
  }

  private findInitializedTrezorConnect(
    providers: Record<string, TrezorProviderLike | undefined>,
  ): unknown {
    for (const key of Object.keys(providers)) {
      const provider = providers[key]
      if (provider && 'TrezorConnect' in provider && provider.TrezorConnect) {
        return provider.TrezorConnect
      }
    }
    return null
  }
}

let trezorManagerSingleton: TrezorManager | null = null

/**
 * Returns the process-wide Trezor manager, creating it once. Reusing a single
 * manager keeps the underlying provider cache warm so `TrezorConnect.init()`
 * runs only once per session — a second connect attempt no longer throws
 * `TrezorConnect has been already initialized`.
 */
export const getTrezorManager = (): TrezorManager => {
  if (!trezorManagerSingleton) {
    trezorManagerSingleton = new TrezorManager()
  }
  return trezorManagerSingleton
}

/** Test-only: reset the module-level singleton between test cases. */
export const resetTrezorManager = (): void => {
  trezorManagerSingleton = null
}
