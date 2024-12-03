import { captureException } from '@sentry/vue'
import type {
  AccessWalletEvent,
  BuySellEvent,
  ConsentEvent,
  ContractEvent,
  CreateWalletEvent,
  DashboardEvent,
  EthVMEvent,
  StakingEvent,
  SwapEvent,
  WalletDirectLinkAccessEvent,
} from './events'
import type { createInstance } from '@amplitude/analytics-browser'

export type AmplitudeAnalyticsOptions = {
  amplitude: ReturnType<typeof createInstance>
}

export type ExtraContext = {
  network?: string
}

const EventType = {
  ETHVM: 'ethvm',
  WALLET_DIRECT_LINK_ACCESS: '???wallet_direct_link_access???',
  CONSENT: 'consent',
  CONTRACT: 'contract',
  DASHBOARD: 'dashboard',
  CREATE_WALLET: 'create_wallet',
  ACCESS_WALLET: 'access_wallet',
  BUY_SELL: 'buy_sell',
  STAKING: 'staking',
  SWAP: 'swap',
} as const
type EventType = (typeof EventType)[keyof typeof EventType]

export class Analytics {
  readonly amplitude: ReturnType<typeof createInstance>
  private _context: ExtraContext

  constructor(opts: AmplitudeAnalyticsOptions) {
    const { amplitude } = opts
    this.amplitude = amplitude
    this._context = {}
  }

  /**
   * Update global Amplitude analytics context
   *
   * @param context   New context to merge with existing context
   */
  patchContext(context: ExtraContext): void {
    this._context = {
      ...this._context,
      ...context,
    }
  }

  /**
   * Opt in or out of tracking
   *
   * @param consent  Whether to opt in or out of tracking
   */
  setTrackingConsent(consent: boolean): void {
    this.amplitude.setOptOut(!consent)
  }

  /**
   * Send an analytics even to Amplitude
   *
   * @param name      Event name
   * @param payload   Event properties
   */
  private async _track(
    name: string,
    payload: Record<PropertyKey, unknown>,
  ): Promise<void> {
    try {
      const ret = this.amplitude.track(name, payload)
      const { promise } = ret
      await promise
    } catch (err) {
      captureException(err)
    }
  }

  /**
   * Send an EthVM analytics event to Amplitude
   *
   * @param event     Type of EthVM event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackEthVMEvent = (
    event: EthVMEvent,
    payload: {
      path: string
    },
  ): Promise<void> => {
    return this._track(EventType.ETHVM, {
      event,
      network: this._context.network,
      ...payload,
    })
  }

  /**
   * Send a Wallet Direct Link Access analytics event to Amplitude
   *
   * @param event     Type of Wallet Direct Link Access event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackWalletDirectLinkAccessEvent = (
    event: WalletDirectLinkAccessEvent,
    payload: {
      to: string
    },
  ): Promise<void> => {
    return this._track(EventType.WALLET_DIRECT_LINK_ACCESS, {
      event,
      network: this._context.network,
      ...payload,
    })
  }

  /**
   * Send a Consent analytics event to Amplitude
   *
   * @param event   Type of Consent event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackConsentEvent = (event: ConsentEvent): Promise<void> => {
    return this._track(EventType.CONSENT, {
      event,
      network: this._context.network,
    })
  }

  /**
   * Send a Dashboard analytics event to Amplitude
   *
   * @param event   Type of Dashboard event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackDashboardEvent = (event: DashboardEvent): Promise<void> => {
    return this._track(EventType.DASHBOARD, {
      event,
      network: this._context.network,
    })
  }

  /**
   * Send a Create Wallet analytics event to Amplitude
   *
   * @param event   Type of Create Wallet event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackCreateWalletEvent = (
    event: CreateWalletEvent,
  ): Promise<void> => {
    return this._track(EventType.CREATE_WALLET, {
      event,
      network: this._context.network,
    })
  }

  /**
   * Send an Access Wallet analytics event to Amplitude
   *
   * @param event   Type of Access Wallet event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackAccessWalletEvent = (
    event: AccessWalletEvent,
  ): Promise<void> => {
    return this._track(EventType.ACCESS_WALLET, {
      event,
      network: this._context.network,
    })
  }

  /**
   * Send a Buy/Sell analytics event to Amplitude
   *
   * @param event   Type of Buy/Sell event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackBuySellEvent = (event: BuySellEvent): Promise<void> => {
    return this._track(EventType.BUY_SELL, {
      event,
      network: this._context.network,
    })
  }

  /**
   * Send a Contract analytics event to Amplitude
   *
   * @param event   Type of Contract event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackContractEvent = (event: ContractEvent): Promise<void> => {
    return this._track(EventType.CONTRACT, {
      event,
      network: this._context.network,
    })
  }

  /**
   * Send a Staking analytics event to Amplitude
   *
   * @param event   Type of Staking event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackStakingEvent = (event: StakingEvent): Promise<void> => {
    return this._track(EventType.STAKING, {
      event,
      network: this._context.network,
    })
  }

  /**
   * Send a Swap analytics event to Amplitude
   *
   * @param event   Type of Swap event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackSwapEvent = (event: SwapEvent): Promise<void> => {
    return this._track(EventType.SWAP, {
      event,
      network: this._context.network,
    })
  }
}
