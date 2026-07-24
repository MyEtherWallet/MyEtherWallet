import { captureException } from '@sentry/vue'
import type {
  ConnectWalletEvent,
  ConnectWalletPayload,
  CreateWalletEvent,
  CreateWalletPayload,
  ConsentEvent,
  DepositEvent,
  NotificationEvent,
  NotificationPayload,
  SelectNewAddressEvent,
  ClickMainMenuEvent,
  ClickMainMenuPayload,
  SendEvent,
  SendPayload,
  SendEventError,
  SendErrorPayload,
  SendEventStatus,
  SendStatusPayload,
  SwapEvent,
  SwapPayloadShared,
  SwapEventError,
  SwapErrorPayload,
  SwapEventStatus,
  SwapStatusPayload,
  TradeEvent,
  TradePayloadShared,
  TradeEventError,
  TradeErrorPayload,
  TradeEventStatus,
  TradeEventStatusPayload,
  ClickTokenTradePayload,
  ClickTokenTradeEvent,
  RewardsEvent,
  RewardsPayload,
  StockMarketEvent,
  StockMarketFilterPayload,
  StockMarketSearchPayload,
  StockMarketClickStockPayload,
  StockMarketClickSortPayload,
  CryptoMarketEvent,
  CryptoMarketFilterPayload,
  CryptoMarketSearchPayload,
  CryptoMarketClickTokenPayload,
  CryptoMarketClickSortPayload,
  CryptoMarketSelectNetworkPayload,
  TradeClickSortEvent,
  SwapClickSortEvent,
  ClickSortPayload,
  PerpsSignInEvent,
  PerpsSignInPayload,
  PerpsSignInErrorPayload,
  PerpsDepositEvent,
  PerpsDepositPayload,
  PerpsDepositErrorPayload,
  PerpsWithdrawEvent,
  PerpsWithdrawPayload,
  PerpsWithdrawErrorPayload,
  PerpsWithdrawAuthorizeEvent,
  PerpsWithdrawAuthorizeErrorPayload,
  PerpsTradeOrderEvent,
  PerpsTradeOrderPayload,
  PerpsTradeOrderFailPayload,
  PerpsTpSlEvent,
  PerpsTpSlSavePayload,
  PerpsChangeLeverageEvent,
  PerpsChangeLeveragePayload,
  PerpsChangeLeverageFailPayload,
  PerpsClosePositionEvent,
  PerpsClosePositionPayload,
  PerpsClosePositionFailPayload,
  PerpsManageEvent,
  PerpsManagePayload,
  PerpsNewPositionPayload,
  PerpsOrderEvent,
  PerpsOrderViewInfoPayload,
  PerpsOrderCancelClickedPayload,
  PerpsOrderCancelSubmitPayload,
  PerpsOrderCancelErrorPayload,
  GlobalSearchEvent,
  GlobalSearchSelectTokenPayload,
  GlobalSearchTokenNotFoundPayload,
  WeekendTradingAnnouncementEvent,
  HoldRewardsBannerEvent,
  HoldRewardsMainCardEvent,
  HoldRewardsMainCardEventPayload,
  RerwadsAndOffersEvent,
  RerwadsAndOffersEventPayload,
  TradeConfirmationBannerEvent,
  TradeConfirmationBannerEventPayload,
  BuyEvent,
  BuyOfferEvent,
  BuyPayloadShared,
  BuyOfferPayloadShared,
  BuyEventError,
  BuyErrorPayload,
  SellEvent,
  SellOfferEvent,
  SellPayloadShared,
  SellOfferPayload,
  SellEventError,
  SellErrorPayload,
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
    if (properties.canClaimRewards !== undefined) {
      identify.set('canClaimRewards', properties.canClaimRewards)
    }
    if (properties.canClaimTrade !== undefined) {
      identify.set('canClaimTrade', properties.canClaimTrade)
    }
    if (properties.canClaimSwap !== undefined) {
      identify.set('canClaimSwap', properties.canClaimSwap)
    }
    if (properties.canTrade !== undefined) {
      identify.set('canTrade', properties.canTrade)
    }
    if (properties.holdCampaignStatus !== undefined) {
      identify.set('holdCampaignStatus', properties.holdCampaignStatus)
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
   * Set display currency user property
   *
   * @param currency   Currency code (e.g. USD, EUR)
   */
  setCurrency(currency: string): void {
    const identify = new Identify()
    identify.set('currency', currency)
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

  /**
   * Set hold campaign status user property
   *
   * @param status   Current RWA hold campaign status
   */
  setHoldCampaignStatus(status: string): void {
    const identify = new Identify()
    identify.set('holdCampaignStatus', status)
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
  // =============================================================================
  // SWAP
  // =============================================================================

  /**
   * Send a Swap analytics event to Amplitude
   *
   * @param event     Type of Swap event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSwapEvent = (
    event: SwapEvent,
    payload?: SwapPayloadShared,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Swap Error analytics event to Amplitude
   *
   * @param event     Type of SwapEventError
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSwapEventError = (
    event: SwapEventError,
    payload?: SwapErrorPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Swap Status analytics event to Amplitude
   *
   * @param event     Type of SwapEventStatus
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSwapEventStatus = (
    event: SwapEventStatus,
    payload?: SwapStatusPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  // =============================================================================
  // SEND
  // =============================================================================

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
   * Send a Send Error analytics event to Amplitude
   *
   * @param event     Type of SendEventError
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSendErrorEvent = (
    event: SendEventError,
    payload?: SendErrorPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Send Status analytics event to Amplitude
   *
   * @param event     Type of SendEventStatus
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSendEventStatus = (
    event: SendEventStatus,
    payload?: SendStatusPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  // =============================================================================
  // TRADE
  // =============================================================================

  /**
   * Send a Trade analytics event to Amplitude
   *
   * @param event     Type of Trade event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackTradeEvent = (
    event: TradeEvent,
    payload?: TradePayloadShared,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Trade Error analytics event to Amplitude
   *
   * @param event     Type of TradeEventError
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackTradeEventError = (
    event: TradeEventError,
    payload?: TradeErrorPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Trade Status analytics event to Amplitude
   *
   * @param event     Type of TradeEventStatus
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackTradeEventStatus = (
    event: TradeEventStatus,
    payload?: TradeEventStatusPayload,
  ): Promise<void> => {
    return this._track(event, {
      ...payload,
    })
  }

  /**
   * Send a Weekend Trading Announcement analytics event to Amplitude
   *
   * @param event   Type of WeekendTradingAnnouncementEvent
   * @returns       Promise that resolves when the event is tracked
   */
  readonly trackWeekendTradingAnnouncementEvent = (
    event: WeekendTradingAnnouncementEvent,
  ): Promise<void> => {
    return this._track(event, {})
  }

  /**
   * Send a Deposit analytics event to Amplitude
   *
   * @param event     Type of Deposit event
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackDepositEvent = (event: DepositEvent): Promise<void> => {
    return this._track(event, {})
  }

  readonly trackSelectNewAddressEvent = (
    event: typeof SelectNewAddressEvent,
  ): Promise<void> => {
    return this._track(event, {})
  }

  readonly trackClickMainMenuEvent = (
    event: typeof ClickMainMenuEvent,
    payload: ClickMainMenuPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
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

  readonly trackClickTokenTradeEvent = (
    event: (typeof ClickTokenTradeEvent)[keyof typeof ClickTokenTradeEvent],
    payload?: ClickTokenTradePayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackRewardsEvent = (
    event: RewardsEvent,
    payload?: RewardsPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // REWARDS HOLD
  // =============================================================================

  readonly trackHoldRewardsBannerEvent = (
    event: (typeof HoldRewardsBannerEvent)[keyof typeof HoldRewardsBannerEvent],
  ): Promise<void> => {
    return this._track(event, {})
  }

  readonly trackHoldRewardsMainCardEvent = (
    event: (typeof HoldRewardsMainCardEvent)[keyof typeof HoldRewardsMainCardEvent],
    payload: HoldRewardsMainCardEventPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackRewardsAndOffersEvent = (
    event: (typeof RerwadsAndOffersEvent)[keyof typeof RerwadsAndOffersEvent],
    payload: RerwadsAndOffersEventPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackTradeConfirmationBannerEvent = (
    event: (typeof TradeConfirmationBannerEvent)[keyof typeof TradeConfirmationBannerEvent],
    payload: TradeConfirmationBannerEventPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // STOCK MARKET
  // =============================================================================

  readonly trackStockMarketFilterEvent = (
    event: typeof StockMarketEvent.SELECTED_FILTER,
    payload: StockMarketFilterPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackStockMarketSearchEvent = (
    event: typeof StockMarketEvent.SEARCH_STOCK,
    payload: StockMarketSearchPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackStockMarketClickStockEvent = (
    event: typeof StockMarketEvent.CLICK_STOCK,
    payload: StockMarketClickStockPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackStockMarketClickSortEvent = (
    event: typeof StockMarketEvent.CLICK_SORT,
    payload: StockMarketClickSortPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // CRYPTO MARKET
  // =============================================================================

  readonly trackCryptoMarketFilterEvent = (
    event: typeof CryptoMarketEvent.SELECTED_FILTER,
    payload: CryptoMarketFilterPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackCryptoMarketSearchEvent = (
    event: typeof CryptoMarketEvent.SEARCH_TOKEN,
    payload: CryptoMarketSearchPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackCryptoMarketClickTokenEvent = (
    event: typeof CryptoMarketEvent.CLICK_TOKEN,
    payload: CryptoMarketClickTokenPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackCryptoMarketClickSortEvent = (
    event: typeof CryptoMarketEvent.CLICK_SORT,
    payload: CryptoMarketClickSortPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackCryptoMarketSelectNetworkEvent = (
    event: typeof CryptoMarketEvent.SELECT_NETWORK,
    payload: CryptoMarketSelectNetworkPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // TRADE / SWAP SORT
  // =============================================================================

  readonly trackTradeClickSortEvent = (
    event: typeof TradeClickSortEvent,
    payload: ClickSortPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackSwapClickSortEvent = (
    event: typeof SwapClickSortEvent,
    payload: ClickSortPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS SIGN IN
  // =============================================================================

  readonly trackPerpsSignInEvent = (
    event: PerpsSignInEvent,
    payload?: PerpsSignInPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // GLOBAL SEARCH
  // =============================================================================

  readonly trackGlobalSearchEvent = (
    event: typeof GlobalSearchEvent.SHOWN,
  ): Promise<void> => {
    return this._track(event, {})
  }

  readonly trackGlobalSearchSelectTokenEvent = (
    event: typeof GlobalSearchEvent.SELECT_TOKEN,
    payload: GlobalSearchSelectTokenPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsSignInErrorEvent = (
    event: typeof PerpsSignInEvent.ERROR,
    payload: PerpsSignInErrorPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS DEPOSIT
  // =============================================================================

  readonly trackPerpsDepositEvent = (
    event: PerpsDepositEvent,
    payload?: PerpsDepositPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsDepositErrorEvent = (
    event: typeof PerpsDepositEvent.ERROR,
    payload: PerpsDepositErrorPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS WITHDRAW
  // =============================================================================

  readonly trackPerpsWithdrawEvent = (
    event: PerpsWithdrawEvent,
    payload?: PerpsWithdrawPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsWithdrawErrorEvent = (
    event: typeof PerpsWithdrawEvent.ERROR,
    payload: PerpsWithdrawErrorPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS WITHDRAW AUTHORIZE
  // =============================================================================

  readonly trackPerpsWithdrawAuthorizeEvent = (
    event:
      | typeof PerpsWithdrawAuthorizeEvent.SUBMIT
      | typeof PerpsWithdrawAuthorizeEvent.SUCCESS,
  ): Promise<void> => {
    return this._track(event, {})
  }

  readonly trackPerpsWithdrawAuthorizeErrorEvent = (
    event: typeof PerpsWithdrawAuthorizeEvent.ERROR,
    payload: PerpsWithdrawAuthorizeErrorPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS TRADE ORDER
  // =============================================================================

  readonly trackPerpsTradeOrderEvent = (
    event: PerpsTradeOrderEvent,
    payload?: PerpsTradeOrderPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsTradeOrderFailEvent = (
    event: typeof PerpsTradeOrderEvent.SUBMIT_FAIL,
    payload: PerpsTradeOrderFailPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS TP/SL
  // =============================================================================

  readonly trackPerpsTpSlEvent = (
    event: PerpsTpSlEvent,
    payload?: PerpsTpSlSavePayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS CHANGE LEVERAGE
  // =============================================================================

  readonly trackPerpsChangeLeverageEvent = (
    event: PerpsChangeLeverageEvent,
    payload: PerpsChangeLeveragePayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsChangeLeverageFailEvent = (
    event: typeof PerpsChangeLeverageEvent.SUBMIT_FAIL,
    payload: PerpsChangeLeverageFailPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS CLOSE POSITION
  // =============================================================================

  readonly trackPerpsClosePositionEvent = (
    event: PerpsClosePositionEvent,
    payload: PerpsClosePositionPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsClosePositionFailEvent = (
    event: typeof PerpsClosePositionEvent.SUBMIT_FAIL,
    payload: PerpsClosePositionFailPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS MANAGE
  // =============================================================================

  readonly trackPerpsManageEvent = (
    event:
      | typeof PerpsManageEvent.CHANGE_LEVERAGE
      | typeof PerpsManageEvent.ADD_TO_POSITION
      | typeof PerpsManageEvent.CLOSE_POSITION,
    payload: PerpsManagePayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsNewPositionEvent = (
    event: typeof PerpsManageEvent.NEW_POSITION,
    payload: PerpsNewPositionPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // PERPS ORDERS
  // =============================================================================

  readonly trackPerpsOrderViewInfoEvent = (
    event: typeof PerpsOrderEvent.CLICKED_VIEW_INFO,
    payload: PerpsOrderViewInfoPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsOrderCancelClickedEvent = (
    event: typeof PerpsOrderEvent.CLICKED_CANCEL,
    payload: PerpsOrderCancelClickedPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsOrderCancelSubmitEvent = (
    event:
      | typeof PerpsOrderEvent.CANCEL_SUBMIT
      | typeof PerpsOrderEvent.CANCEL_SUBMIT_SUCCESS,
    payload: PerpsOrderCancelSubmitPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackPerpsOrderCancelErrorEvent = (
    event: typeof PerpsOrderEvent.CANCEL_SUBMIT_ERROR,
    payload: PerpsOrderCancelErrorPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  readonly trackGlobalSearchTokenNotFoundEvent = (
    event: typeof GlobalSearchEvent.TOKEN_NOT_FOUND,
    payload: GlobalSearchTokenNotFoundPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // BUY
  // =============================================================================

  /**
   * Send a Buy analytics event to Amplitude
   *
   * @param event     Type of Buy event
   * @param payload   Event properties (shared, or offer payload for offer events)
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackBuyEvent = (
    event: BuyEvent | BuyOfferEvent,
    payload: BuyPayloadShared | BuyOfferPayloadShared,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  /**
   * Send a Buy Error analytics event to Amplitude
   *
   * @param event     Type of BuyEventError
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackBuyEventError = (
    event: BuyEventError,
    payload: BuyErrorPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  // =============================================================================
  // SELL
  // =============================================================================

  /**
   * Send a Sell analytics event to Amplitude
   *
   * @param event     Type of Sell event
   * @param payload   Event properties (shared, or offer payload for offer events)
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSellEvent = (
    event: SellEvent | SellOfferEvent,
    payload: SellPayloadShared | SellOfferPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }

  /**
   * Send a Sell Error analytics event to Amplitude
   *
   * @param event     Type of SellEventError
   * @param payload   Event properties
   * @returns         Promise that resolves when the event is tracked
   */
  readonly trackSellEventError = (
    event: SellEventError,
    payload: SellErrorPayload,
  ): Promise<void> => {
    return this._track(event, { ...payload })
  }
}
