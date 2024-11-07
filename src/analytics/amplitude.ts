import type {
  AccessWalletEvent,
  BuySellEvent,
  ConsentEvent,
  ContractEvent,
  CreateWalletEvent,
  DashboardEvent,
  EthVMEvent,
  HeaderEvent,
  LandingPageEvent,
  StakingEvent,
  SwapEvent,
  WalletDirectLinkAccessEvent,
} from './events'
import { type createInstance } from '@amplitude/analytics-browser'

type AmplitudeAnalyticsOptions = {
  amplitude: ReturnType<typeof createInstance>
}

export class Analytics {
  amplitude: ReturnType<typeof createInstance>

  constructor(opts: AmplitudeAnalyticsOptions) {
    const { amplitude } = opts
    this.amplitude = amplitude
  }

  setConsentToTrack(value: boolean): void {
    this.amplitude.setOptOut(value)
  }

  private async _track(
    name: string,
    payload: Record<PropertyKey, unknown>,
  ): Promise<void> {
    const ret = this.amplitude.track(name, payload)
    const { promise } = ret
    await promise
  }

  trackEthVMEvent = (
    event: EthVMEvent,
    payload: {
      path: string
      network: string
    },
  ): Promise<void> => {
    return this._track('ethvm', { event, ...payload })
  }

  trackWalletDirectLinkAccessEvent = (
    event: WalletDirectLinkAccessEvent,
    payload: {
      to: string
    },
  ): Promise<void> => {
    return this._track('???wallet_direct_link_access???', { event, ...payload })
  }

  trackConsentEvent = (
    event: ConsentEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('consent', { event, ...payload })
  }

  trackLandingPageEvent = (
    event: LandingPageEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('landing_page', { event, ...payload })
  }

  trackHeaderEvent = (
    event: HeaderEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('header', { event, ...payload })
  }

  trackDashboardEvent = (
    event: DashboardEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('dashboard', { event, ...payload })
  }

  trackCreateWalletEvent = (
    event: CreateWalletEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('create_wallet', { event, ...payload })
  }

  trackAccessWalletEvent = (
    event: AccessWalletEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('access_wallet', { event, ...payload })
  }

  trackBuySellEvent = (
    event: BuySellEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('buy_sell', { event, ...payload })
  }

  trackContractEvent = (
    event: ContractEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('contract', { event, ...payload })
  }

  trackStakingEvent = (
    event: StakingEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('staking', { event, ...payload })
  }

  trackSwapEvent = (
    event: SwapEvent,
    payload: {
      network: string
    },
  ): Promise<void> => {
    return this._track('swap', { event, ...payload })
  }
}
