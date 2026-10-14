import type {
  GenericResponse,
  StatusResult,
  LoginGetChallengeRequest,
  LoginChallengeResult,
  LoginCompleteChallengeRequest,
  LoginCompleteChallengeResult,
  AgreementRequest,
  MarketsResult,
  Contract,
  HistoryResult,
  DepositAddressListRequest,
  DepositAddress,
  ProvisionAddressRequest,
  ProvisionAddressResult,
  AccountInfo,
  PortfolioSummary,
  PortfolioGraphPoint,
  PerpsBalance,
  AddressBookResult,
  AddressBookGetChallengeRequest,
  AddressBookCompleteChallengeRequest,
  WithdrawRequest,
  WithdrawResult,
  CreateOrderRequest,
  OrderResult,
  Position,
  LeverageSetting,
  MarkPrice,
  MaxOrderSizeResult,
  PaginatedResponse,
  ApiOrder,
  ApiFill,
  WalletDeposit,
  WalletWithdrawal,
  MarketInfoData,
} from './types'

/**
 * Thrown for any non-2xx response, carrying the HTTP status so callers can tell
 * classes of failure apart — a 429 is a throttle to back off from, a 5xx is an
 * outage worth surfacing. `message` is unchanged from the plain `Error` this
 * replaced (the body's `error` field, else `HTTP <status>`), so callers that
 * only read the message keep working.
 */
export class PerpsHttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'PerpsHttpError'
    this.status = status
  }
}

/**
 * Thrown instead of issuing a request while the service is known to be down.
 * Distinct from `PerpsHttpError` because no request was made and there is no
 * status to report — nothing reached the network.
 */
export class PerpsServiceUnavailableError extends Error {
  constructor() {
    super('Perps service unavailable')
    this.name = 'PerpsServiceUnavailableError'
  }
}

/**
 * The one path that stays reachable while the service is marked unavailable —
 * it is how the outage is detected and, more importantly, how recovery is
 * detected. Gating it would latch the outage forever.
 */
const STATUS_PATH = '/status'

export class PerpsClient {
  private baseUrl: string
  private token: string | null = null
  private onUnauthorized: (() => void) | null = null
  private serviceUnavailable = false

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Marks the service up or down. While down, every request except `/status`
   * fails immediately without touching the network — there is no point asking
   * 30-odd endpoints for data the service has just said it cannot serve, and
   * each one would otherwise add its own failed request, error toast and Sentry
   * report to an outage the user has already been told about.
   *
   * Driven by `usePerpsStatus`, which owns the `/status` polling.
   */
  setServiceUnavailable(unavailable: boolean) {
    this.serviceUnavailable = unavailable
  }

  isServiceUnavailable(): boolean {
    return this.serviceUnavailable
  }

  setToken(token: string | null) {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  setOnUnauthorized(handler: (() => void) | null) {
    this.onUnauthorized = handler
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    // Single choke point for every endpoint on this client, so a new method
    // cannot forget the gate.
    if (this.serviceUnavailable && path !== STATUS_PATH) {
      throw new PerpsServiceUnavailableError()
    }
    const res = await fetch(`${this.baseUrl}${path}`, options)
    if (!res.ok) {
      if (res.status === 401 && this.onUnauthorized) {
        this.onUnauthorized()
      }
      let msg = `HTTP ${res.status}`
      try {
        const body = await res.json()
        if (body?.error) msg = body.error
      } catch {
        // ignore parse errors
      }
      throw new PerpsHttpError(res.status, msg)
    }
    return res.json()
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  private async authGet<T>(path: string): Promise<T> {
    if (!this.token) throw new Error('Not authenticated')
    return this.request<T>(path, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  private async authPost<T>(path: string, body: unknown): Promise<T> {
    if (!this.token) throw new Error('Not authenticated')
    return this.request<T>(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
    })
  }

  private async authDelete<T>(path: string): Promise<T> {
    if (!this.token) throw new Error('Not authenticated')
    return this.request<T>(path, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  async getStatus(): Promise<GenericResponse<StatusResult>> {
    return this.request<GenericResponse<StatusResult>>(STATUS_PATH)
  }

  async getLoginChallenge(
    data: LoginGetChallengeRequest,
  ): Promise<GenericResponse<LoginChallengeResult>> {
    return this.post<GenericResponse<LoginChallengeResult>>(
      '/v1/auth/erc-4361/login/get_challenge',
      data,
    )
  }

  async completeLoginChallenge(
    data: LoginCompleteChallengeRequest,
  ): Promise<GenericResponse<LoginCompleteChallengeResult>> {
    return this.post<GenericResponse<LoginCompleteChallengeResult>>(
      '/v1/auth/erc-4361/login/complete_challenge',
      data,
    )
  }

  async acceptAgreement(
    data: AgreementRequest,
  ): Promise<GenericResponse<void>> {
    return this.authPost<GenericResponse<void>>('/v1/agreement', data)
  }

  async getMarkets(): Promise<GenericResponse<MarketsResult>> {
    return this.request<GenericResponse<MarketsResult>>('/v1/markets')
  }

  async getContracts(sparkline = false): Promise<GenericResponse<Contract[]>> {
    const params = sparkline ? '?sparkline=true' : ''
    return this.request<GenericResponse<Contract[]>>(
      `/v1/perps/contracts${params}`,
    )
  }

  async getHistory(
    symbol: string,
    resolution: string,
    from: number,
    to: number,
  ): Promise<HistoryResult> {
    const params = new URLSearchParams({
      symbol: symbol.replace(`-`, ''),
      resolution,
      from: from.toString(),
      to: to.toString(),
    })
    return this.request<HistoryResult>(`/v1/perps/history?${params.toString()}`)
  }

  async listDepositAddresses(
    data: DepositAddressListRequest,
  ): Promise<GenericResponse<DepositAddress[]>> {
    return this.authPost<GenericResponse<DepositAddress[]>>(
      '/v1/wallet/deposit_address/list',
      data,
    )
  }

  async provisionAddress(
    data: ProvisionAddressRequest,
  ): Promise<GenericResponse<ProvisionAddressResult>> {
    return this.authPost<GenericResponse<ProvisionAddressResult>>(
      '/v1/provision_address',
      data,
    )
  }

  async sandboxDeposit(data: {
    amount: string
    symbol: string
    deposit_destination: { id: string; wallet: string }
    chain_id: string
  }): Promise<GenericResponse<{ deposit_address: string; txn_hash: string }>> {
    return this.authPost('/v1/sandbox_deposit', data)
  }

  async getAccount(): Promise<GenericResponse<AccountInfo>> {
    return this.authGet<GenericResponse<AccountInfo>>('/v1/account')
  }

  async getPortfolioSummary(): Promise<GenericResponse<PortfolioSummary>> {
    return this.authGet<GenericResponse<PortfolioSummary>>(
      '/v1/portfolio/summary',
    )
  }

  async getPortfolioGraph(
    range: '24h' | '7d' | '30d' | 'all' = '30d',
  ): Promise<GenericResponse<PortfolioGraphPoint[]>> {
    return this.authGet<GenericResponse<PortfolioGraphPoint[]>>(
      `/v1/portfolio/summary/graph?range=${range}`,
    )
  }

  async getPerpsBalance(): Promise<GenericResponse<PerpsBalance>> {
    return this.authGet<GenericResponse<PerpsBalance>>('/v1/perps/balance')
  }

  async getAddressBook(): Promise<GenericResponse<AddressBookResult>> {
    return this.authGet<GenericResponse<AddressBookResult>>(
      '/v1/wallet/address_book',
    )
  }

  async getAddressBookChallenge(
    data: AddressBookGetChallengeRequest,
  ): Promise<GenericResponse<LoginChallengeResult>> {
    return this.authPost<GenericResponse<LoginChallengeResult>>(
      '/v1/auth/erc-4361/address_book/get_challenge',
      data,
    )
  }

  async completeAddressBookChallenge(
    data: AddressBookCompleteChallengeRequest,
  ): Promise<GenericResponse<void>> {
    return this.authPost<GenericResponse<void>>(
      '/v1/auth/erc-4361/address_book/complete_challenge',
      data,
    )
  }

  async withdraw(
    data: WithdrawRequest,
  ): Promise<GenericResponse<WithdrawResult>> {
    return this.authPost<GenericResponse<WithdrawResult>>('/v1/withdraw', data)
  }

  async createOrder(
    data: CreateOrderRequest,
  ): Promise<GenericResponse<OrderResult>> {
    return this.authPost<GenericResponse<OrderResult>>('/v1/perps/orders', data)
  }

  async cancelOrder(orderId: string): Promise<GenericResponse<OrderResult>> {
    return this.authDelete<GenericResponse<OrderResult>>(
      `/v1/perps/orders/${encodeURIComponent(orderId)}`,
    )
  }

  async getPositions(): Promise<GenericResponse<Position[]>> {
    return this.authGet<GenericResponse<Position[]>>('/v1/perps/positions')
  }

  async getLeverage(
    market?: string,
  ): Promise<GenericResponse<LeverageSetting[]>> {
    const params = market ? `?market=${encodeURIComponent(market)}` : ''
    return this.authGet<GenericResponse<LeverageSetting[]>>(
      `/v1/perps/leverage${params}`,
    )
  }

  async setLeverage(
    market: string,
    leverage: number,
  ): Promise<GenericResponse<LeverageSetting>> {
    return this.authPost<GenericResponse<LeverageSetting>>(
      '/v1/perps/leverage',
      { market, leverage: leverage.toString() },
    )
  }

  async getMarkPrices(): Promise<GenericResponse<Record<string, MarkPrice>>> {
    return this.request<GenericResponse<Record<string, MarkPrice>>>(
      '/v1/perps/mark_prices',
    )
  }

  async getMaxOrderSize(
    market: string,
    buffer?: number,
  ): Promise<GenericResponse<MaxOrderSizeResult>> {
    const params = new URLSearchParams({ market })
    if (buffer !== undefined) params.set('buffer', buffer.toString())
    return this.authGet<GenericResponse<MaxOrderSizeResult>>(
      `/v1/perps/max_order_size?${params.toString()}`,
    )
  }

  async getOrders(opts?: {
    market?: string
    status?: string
    limit?: number
    cursor?: string
  }): Promise<PaginatedResponse<ApiOrder>> {
    const params = new URLSearchParams()
    if (opts?.market) params.set('market', opts.market)
    if (opts?.status) params.set('status', opts.status)
    if (opts?.limit) params.set('limit', opts.limit.toString())
    if (opts?.cursor) params.set('cursor', opts.cursor)
    const qs = params.toString()
    return this.authGet<PaginatedResponse<ApiOrder>>(
      `/v1/perps/orders${qs ? `?${qs}` : ''}`,
    )
  }

  async getOrder(orderId: string): Promise<GenericResponse<ApiOrder>> {
    return this.authGet<GenericResponse<ApiOrder>>(
      `/v1/perps/orders/${encodeURIComponent(orderId)}`,
    )
  }

  async getFills(opts?: {
    market?: string
    limit?: number
    cursor?: string
  }): Promise<PaginatedResponse<ApiFill>> {
    const params = new URLSearchParams()
    if (opts?.market) params.set('market', opts.market)
    if (opts?.limit) params.set('limit', opts.limit.toString())
    if (opts?.cursor) params.set('cursor', opts.cursor)
    const qs = params.toString()
    return this.authGet<PaginatedResponse<ApiFill>>(
      `/v1/perps/fills${qs ? `?${qs}` : ''}`,
    )
  }

  async getDeposits(): Promise<GenericResponse<WalletDeposit[]>> {
    return this.authGet<GenericResponse<WalletDeposit[]>>('/v1/wallet/deposits')
  }

  async getWithdrawals(): Promise<GenericResponse<WalletWithdrawal[]>> {
    return this.authGet<GenericResponse<WalletWithdrawal[]>>(
      '/v1/wallet/withdrawals',
    )
  }

  async getPerpetualInfo(
    perpetual: string,
  ): Promise<GenericResponse<MarketInfoData>> {
    return this.request<GenericResponse<MarketInfoData>>(
      `/v1/markets/info/${encodeURIComponent(perpetual)}`,
    )
  }
}
