import { captureException } from '@sentry/vue'
import type {
  ConnectWalletEvent,
  ConnectWalletPayload,
  CreateWalletEvent,
  CreateWalletPayload,
  BridgeEvent,
  BridgePayload,
  BuyEvent,
  BuyPayload,
  ConsentEvent,
  DepositEvent,
  DepositPayload,
  NotificationEvent,
  NotificationPayload,
  SellEvent,
  SellPayload,
  SendEvent,
  SendPayload,
  SwapEvent,
  SwapPayload,
  WalletConnectionEvent,
  WalletConnectionPayload,
} from './events'
import {
  type BalanceBracket,
  type UserProperties,
  type WalletStatus,
} from './user'
import { WalletConfigType } from '@/modules/access/common/walletConfigs'
import type { createInstance } from '@amplitude/analytics-browser'
import { Identify } from '@amplitude/analytics-browser'

export type AmplitudeAnalyticsOptions = {
  amplitude: ReturnType<typeof createInstance>
}

export class Analytics {
  readonly amplitude: ReturnType<typeof createInstance>

  constructor(opts: AmplitudeAnalyticsOptions) {
    const { amplitude } = opts
    this.amplitude = amplitude
  }

  // =============================================================================
  // User Properties
  // =============================================================================

  /**
   * Set all user properties at once
   *
   * @param properties   User properties to set
   */
  setUserProperties(properties: UserProperties): void {
    const identify = new Identify()

    if (properties.walletStatus !== undefined) {
      identify.set('walletStatus', properties.walletStatus)
    }
    if (properties.walletName !== undefined) {
      identify.set('walletName', properties.walletName)
    }
    if (properties.walletType !== undefined) {
      identify.set('walletType', properties.walletType)
    }
    if (properties.network !== undefined) {
      identify.set('network', properties.network)
    }
    if (properties.balanceBracket !== undefined) {
      identify.set('balanceBracket', properties.balanceBracket)
    }
    if (properties.isRWAHolder !== undefined) {
      identify.set('isRWAHolder', properties.isRWAHolder)
    }
    if (properties.isStablecoinHolder !== undefined) {
      identify.set('isStablecoinHolder', properties.isStablecoinHolder)
    }
    if (properties.isCryptoHolder !== undefined) {
      identify.set('isCryptoHolder', properties.isCryptoHolder)
    }
    if (properties.isPartnerHolder !== undefined) {
      identify.set('isPartnerHolder', properties.isPartnerHolder)
    }
    if (properties.hasBalance !== undefined) {
      identify.set('hasBalance', properties.hasBalance)
    }

    this.amplitude.identify(identify)
  }

  /**
   * Set wallet status user property
   *
   * @param status   Wallet connection status
   */
  setWalletStatus(status: WalletStatus): void {
    const identify = new Identify()
    identify.set('walletStatus', status)
    this.amplitude.identify(identify)
  }

  /**
   * Set wallet name user property
   *
   * @param name   Wallet name
   */
  setWalletName(name: string): void {
    const identify = new Identify()
    identify.set('walletName', name)
    this.amplitude.identify(identify)
  }

  /**
   * Set wallet type user property
   *
   * @param type   Wallet type (software, hardware, rainbow kit, web3)
   */
  setWalletType(type: WalletConfigType): void {
    const identify = new Identify()
    identify.set('walletType', type)
    this.amplitude.identify(identify)
  }

  /**
   * Set network user property
   *
   * @param network   Network name
   */
  setNetwork(network: string): void {
    const identify = new Identify()
    identify.set('network', network)
    this.amplitude.identify(identify)
  }

  /**
   * Set balance bracket user property
   *
   * @param bracket   Balance bracket
   */
  setBalanceBracket(bracket: BalanceBracket): void {
    const identify = new Identify()
    identify.set('balanceBracket', bracket)
    this.amplitude.identify(identify)
  }

  /**
   * Set RWA holder user property
   *
   * @param isHolder   Whether user holds RWA assets
   */
  setIsRWAHolder(isHolder: boolean): void {
    const identify = new Identify()
    identify.set('isRWAHolder', isHolder)
    this.amplitude.identify(identify)
  }

  /**
   * Set stablecoin holder user property
   *
   * @param isHolder   Whether user holds stablecoins
   */
  setIsStablecoinHolder(isHolder: boolean): void {
    const identify = new Identify()
    identify.set('isStablecoinHolder', isHolder)
    this.amplitude.identify(identify)
  }

  /**
   * Set crypto holder user property
   *
   * @param isHolder   Whether user holds crypto assets
   */
  setIsCryptoHolder(isHolder: boolean): void {
    const identify = new Identify()
    identify.set('isCryptoHolder', isHolder)
    this.amplitude.identify(identify)
  }

  /**
   * Set partner holder user property
   *
   * @param isHolder   Whether user holds partner assets (e.g., ONDO)
   */
  setIsPartnerHolder(isHolder: boolean): void {
    const identify = new Identify()
    identify.set('isPartnerHolder', isHolder)
    this.amplitude.identify(identify)
  }

  /**
   * Set has balance user property
   *
   * @param hasBalance   Whether user has any balance
   */
  setHasBalance(hasBalance: boolean): void {
    const identify = new Identify()
    identify.set('hasBalance', hasBalance)
    this.amplitude.identify(identify)
  }

  // =============================================================================
  // Events
  // =============================================================================

  /**
   * Opt in or out of tracking
   *
   * @param consent  Whether to opt in or out of tracking
   */
  setTrackingConsent(consent: boolean): void {
    this.amplitude.setOptOut(!consent)
  }

  /**
   * Send an analytics event to Amplitude
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
   * Send a Consent analytics event to Amplitude
   *
   * @param event   Type of Consent event
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackConsentEvent = (event: ConsentEvent): Promise<void> => {
    return this._track(event, {})
  }

  /**
   * Send a Connect Wallet analytics event to Amplitude
   *
   * @param event     Type of Connect Wallet event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackConnectWalletEvent = (
    event: ConnectWalletEvent,
    payload?: ConnectWalletPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Create Wallet analytics event to Amplitude
   *
   * @param event     Type of Create Wallet event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackCreateWalletEvent = (
    event: CreateWalletEvent,
    payload?: CreateWalletPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Swap analytics event to Amplitude
   *
   * @param event     Type of Swap event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSwapEvent = (
    event: SwapEvent,
    payload?: SwapPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Send analytics event to Amplitude
   *
   * @param event     Type of Send event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSendEvent = (
    event: SendEvent,
    payload?: SendPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Bridge analytics event to Amplitude
   *
   * @param event     Type of Bridge event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackBridgeEvent = (
    event: BridgeEvent,
    payload?: BridgePayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Deposit analytics event to Amplitude
   *
   * @param event     Type of Deposit event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackDepositEvent = (
    event: DepositEvent,
    payload?: DepositPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Buy analytics event to Amplitude
   *
   * @param event     Type of Buy event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackBuyEvent = (
    event: BuyEvent,
    payload?: BuyPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Sell analytics event to Amplitude
   *
   * @param event     Type of Sell event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSellEvent = (
    event: SellEvent,
    payload?: SellPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Wallet Connection analytics event to Amplitude
   *
   * @param event     Type of Wallet Connection event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackWalletConnectionEvent = (
    event: WalletConnectionEvent,
    payload?: WalletConnectionPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Notification analytics event to Amplitude
   *
   * @param event     Type of Notification event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackNotificationEvent = (
    event: NotificationEvent,
    payload?: NotificationPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }
}
