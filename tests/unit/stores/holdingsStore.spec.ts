import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { RwaInfoResponse } from '@/mew_api/schemaRwaRewards'

// The store mirrors its status onto the analytics profile; the real module
// loads Amplitude and the hw-wallet chain, neither of which resolves in jsdom.
vi.mock('@/analytics', () => ({
  analytics: { setHoldCampaignStatus: vi.fn() },
}))

// holdingsStore imports walletStore, which transitively pulls in the wallet
// provider chain (Ledger / hw wallets) — irrelevant here and unresolvable under
// jsdom. Stub it with a minimal real setup store so `storeToRefs` still works.
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useWalletStore: defineStore('wallet', () => ({
      wallet: ref(null),
      walletAddress: ref(''),
    })),
  }
})

const { useHoldingsStore } = await import('@/stores/holdingsStore')

const ADDRESS = '0x1111111111111111111111111111111111111111'

const season = (over: Partial<RwaInfoResponse['info']> = {}) => ({
  now: '2026-01-01T00:00:00Z',
  end: '2099-01-01T00:00:00Z',
  rewards: [],
  qualification_value: '500',
  ...over,
})

// `/info` with no address answers with the season block and no entries of its
// own; the address-scoped route adds the wallet's buckets.
const campaignBody = (over: Partial<RwaInfoResponse> = {}): RwaInfoResponse =>
  ({
    info: season(),
    qualified: [],
    disqualified: [],
    claimed: [],
    pending: [],
    ...over,
  }) as RwaInfoResponse

const walletBody = (): RwaInfoResponse =>
  campaignBody({
    pending: [{ uuid: 'entry-1', address: ADDRESS }],
  } as unknown as Partial<RwaInfoResponse>)

const ok = (body: unknown) => ({
  ok: true,
  status: 200,
  json: async () => body,
})
const fail = (status: number, body: unknown = {}) => ({
  ok: false,
  status,
  json: async () => body,
})

/** A response whose resolution we control, to interleave the two requests. */
const deferred = <T>() => {
  let resolve!: (v: T) => void
  const promise = new Promise<T>(r => {
    resolve = r
  })
  return { promise, resolve }
}

describe('holdingsStore — addressless first load', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests /info with no address query', async () => {
    const fetchMock = vi.fn().mockResolvedValue(ok(campaignBody()))
    vi.stubGlobal('fetch', fetchMock)

    const store = useHoldingsStore()
    await store.fetchCampaignInfo()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const url = String(fetchMock.mock.calls[0][0])
    expect(url).toMatch(/\/info$/)
    expect(url).not.toContain('address')
  })

  // The point of the call: the countdown and threshold render pre-connect.
  it('exposes the season data to a visitor with no wallet', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(campaignBody())))

    const store = useHoldingsStore()
    await store.fetchCampaignInfo()

    expect(store.seasonEnd).toBe('2099-01-01T00:00:00Z')
    expect(store.qualificationValue).toBe('500')
    expect(store.status).toBe('default')
    expect(store.hadInitialLoad).toBe(true)
    expect(store.isLoading).toBe(false)
  })

  it('skips the request entirely once an address poll owns the state', async () => {
    const fetchMock = vi.fn().mockResolvedValue(ok(walletBody()))
    vi.stubGlobal('fetch', fetchMock)

    const store = useHoldingsStore()
    await store.fetchInfo(ADDRESS)
    fetchMock.mockClear()

    await store.fetchCampaignInfo()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // The race that matters: a wallet connects while the addressless request is
  // still open. Its bucket-less body must not land on top of the wallet's.
  it('discards its own response if a wallet connected mid-flight', async () => {
    const campaign = deferred<ReturnType<typeof ok>>()
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      return String(url).includes('address')
        ? Promise.resolve(ok(walletBody()))
        : campaign.promise
    })
    vi.stubGlobal('fetch', fetchMock)

    const store = useHoldingsStore()
    const pendingCampaign = store.fetchCampaignInfo()

    // Wallet connects and its poll resolves first.
    await store.fetchInfo(ADDRESS)
    expect(store.pending).toHaveLength(1)

    // Now the slower addressless response arrives.
    campaign.resolve(ok(campaignBody()))
    await pendingCampaign

    expect(store.pending).toHaveLength(1)
    expect(store.pending[0].uuid).toBe('entry-1')
    expect(store.isLoading).toBe(false)
  })

  it('reads a season-wide refusal as a block, not a transient failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fail(404)))

    const store = useHoldingsStore()
    await store.fetchCampaignInfo()

    expect(store.isCampaignFull).toBe(true)
    expect(store.status).toBe('campaignFull')
    expect(store.canRegisterTrade).toBe(false)
  })

  it('leaves the season open on a transient failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fail(500)))

    const store = useHoldingsStore()
    await store.fetchCampaignInfo()

    expect(store.status).toBe('default')
    expect(store.isCampaignFull).toBe(false)
    expect(store.error).toBe('Failed to fetch RWA rewards')
    expect(store.hadInitialLoad).toBe(true)
  })

  // The live route answers with the season block and no buckets at all.
  it('normalises a bucket-less body to empty buckets', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ info: season() })))

    const store = useHoldingsStore()
    await store.fetchCampaignInfo()

    expect(store.pending).toEqual([])
    expect(store.qualified).toEqual([])
    expect(store.hasReward).toBe(false)
    expect(store.seasonEnd).toBe('2099-01-01T00:00:00Z')
  })

  describe('the address poll must not erase the season block', () => {
    // The reported bug: connecting a wallet with no entries blanked the
    // "Expires in" countdown, because a refused address-scoped response nulled
    // the whole payload — season block included.
    it('keeps the countdown alive when the wallet is refused', async () => {
      const fetchMock = vi
        .fn()
        .mockImplementation((url: string) =>
          Promise.resolve(
            String(url).includes('address') ? fail(403) : ok(campaignBody()),
          ),
        )
      vi.stubGlobal('fetch', fetchMock)

      const store = useHoldingsStore()
      await store.fetchCampaignInfo()
      expect(store.seasonEnd).toBe('2099-01-01T00:00:00Z')

      await store.fetchInfo(ADDRESS)

      expect(store.seasonEnd).toBe('2099-01-01T00:00:00Z')
      expect(store.qualificationValue).toBe('500')
      // The wallet's own buckets are still dropped — a refusal must not leave
      // an entry looking claimable.
      expect(store.hasReward).toBe(false)
    })

    it('keeps the season block when the wallet response omits it', async () => {
      const walletOnly = {
        qualified: [],
        disqualified: [],
        claimed: [],
        pending: [{ uuid: 'entry-1', address: ADDRESS }],
      }
      const fetchMock = vi
        .fn()
        .mockImplementation((url: string) =>
          Promise.resolve(
            String(url).includes('address')
              ? ok(walletOnly)
              : ok(campaignBody()),
          ),
        )
      vi.stubGlobal('fetch', fetchMock)

      const store = useHoldingsStore()
      await store.fetchCampaignInfo()
      await store.fetchInfo(ADDRESS)

      expect(store.seasonEnd).toBe('2099-01-01T00:00:00Z')
      expect(store.qualificationValue).toBe('500')
      expect(store.pending).toHaveLength(1)
      expect(store.status).toBe('holding')
    })

    it('still lets the wallet response update the season block', async () => {
      const fetchMock = vi.fn().mockImplementation((url: string) =>
        Promise.resolve(
          String(url).includes('address')
            ? ok(
                campaignBody({
                  info: season({ end: '2100-06-01T00:00:00Z' }),
                }),
              )
            : ok(campaignBody()),
        ),
      )
      vi.stubGlobal('fetch', fetchMock)

      const store = useHoldingsStore()
      await store.fetchCampaignInfo()
      await store.fetchInfo(ADDRESS)

      expect(store.seasonEnd).toBe('2100-06-01T00:00:00Z')
    })
  })

  // A 403 covers both a blocked region and a banned wallet, and the two get
  // different copy. Only the bare `Forbidden` may be read as a region block.
  describe('403 refusals', () => {
    const refused = (body: unknown) =>
      vi
        .fn()
        .mockImplementation((url: string) =>
          Promise.resolve(
            String(url).includes('address')
              ? fail(403, body)
              : ok(campaignBody()),
          ),
        )

    it('reads a bare Forbidden as a region block', async () => {
      vi.stubGlobal('fetch', refused({ msg: 'Forbidden' }))

      const store = useHoldingsStore()
      await store.fetchInfo(ADDRESS)

      expect(store.status).toBe('notEligible')
      expect(store.isRegionBlocked).toBe(true)
    })

    it('leaves a wallet-level refusal off the region copy', async () => {
      vi.stubGlobal('fetch', refused({ msg: 'Address is banned' }))

      const store = useHoldingsStore()
      await store.fetchInfo(ADDRESS)

      expect(store.status).toBe('notEligible')
      expect(store.isRegionBlocked).toBe(false)
    })

    it('treats a 403 with no readable body as unexplained', async () => {
      const noBody = {
        ok: false,
        status: 403,
        json: async () => {
          throw new Error('not json')
        },
      }
      vi.stubGlobal(
        'fetch',
        vi
          .fn()
          .mockImplementation((url: string) =>
            Promise.resolve(
              String(url).includes('address') ? noBody : ok(campaignBody()),
            ),
          ),
      )

      const store = useHoldingsStore()
      await store.fetchInfo(ADDRESS)

      expect(store.status).toBe('notEligible')
      expect(store.isRegionBlocked).toBe(false)
    })

    it('clears the region block once the wallet is let through', async () => {
      const fetchMock = refused({ msg: 'Forbidden' })
      vi.stubGlobal('fetch', fetchMock)

      const store = useHoldingsStore()
      await store.fetchInfo(ADDRESS)
      expect(store.isRegionBlocked).toBe(true)

      fetchMock.mockResolvedValue(ok(walletBody()))
      await store.fetchInfo(ADDRESS)

      expect(store.isRegionBlocked).toBe(false)
      expect(store.status).toBe('holding')
    })
  })

  it('does not let a stale refusal block a wallet that has entries', async () => {
    const campaign = deferred<ReturnType<typeof fail>>()
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      return String(url).includes('address')
        ? Promise.resolve(ok(walletBody()))
        : campaign.promise
    })
    vi.stubGlobal('fetch', fetchMock)

    const store = useHoldingsStore()
    const pendingCampaign = store.fetchCampaignInfo()
    await store.fetchInfo(ADDRESS)

    campaign.resolve(fail(404))
    await pendingCampaign

    expect(store.isCampaignFull).toBe(false)
    expect(store.status).toBe('holding')
  })
})

describe('qualification threshold (server-driven)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('parses the server value for comparisons and for copy', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(campaignBody())))
    const store = useHoldingsStore()
    await store.fetchCampaignInfo()
    expect(store.qualificationUsd).toBe(500)
    expect(store.qualificationAmount).toBe('500')
  })

  it('normalises a decimal string so copy reads "250", not "250.00"', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          ok(campaignBody({ info: season({ qualification_value: '250.00' }) })),
        ),
    )
    const store = useHoldingsStore()
    await store.fetchCampaignInfo()
    expect(store.qualificationUsd).toBe(250)
    expect(store.qualificationAmount).toBe('250')
  })

  it('reports null before /info lands, so no caller promises a reward on an unknown threshold', () => {
    const store = useHoldingsStore()
    expect(store.qualificationUsd).toBeNull()
    // ...but copy still renders a number rather than a bare '$'.
    expect(store.qualificationAmount).toBe('250')
  })

  it('treats an unusable server value as unknown', async () => {
    for (const bad of ['', '0', 'abc', '-5']) {
      setActivePinia(createPinia())
      vi.stubGlobal(
        'fetch',
        vi
          .fn()
          .mockResolvedValue(
            ok(campaignBody({ info: season({ qualification_value: bad }) })),
          ),
      )
      const store = useHoldingsStore()
      await store.fetchCampaignInfo()
      expect(store.qualificationUsd, `value ${JSON.stringify(bad)}`).toBeNull()
    }
  })
})

/**------------------------
 * Season 2 — second reward round. Fixtures mirror the API doc's payloads:
 * the claimed round-1 entry stays in `claimed` while the round-2 entry moves
 * through the buckets, and the top-level `round2` summary is authoritative
 * for everything after the round-1 claim.
 -------------------------*/
const R1_UUID = 'f3f3d13f-42cf-4686-b6d0-bdfb129202d6'
const R2_UUID = '33d868d9-f418-4b22-9e6a-412a33a9fc55'
const USDC_ETH = 'crypto:1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

const metas = [
  {
    id: USDC_ETH,
    name: 'USDC',
    symbol: 'USDC',
    icon: '',
    crypto: {
      ids: ['1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'],
      decimals: [6],
      price: '1',
      market_data: { change: '0' },
    },
  },
]

const entry = (over: Record<string, unknown> = {}) => ({
  uuid: R1_UUID,
  id: 'rwa:AAL',
  season: 'season2',
  round: 1,
  address: ADDRESS,
  chain_id: 1,
  contract_address: '0xbe8e',
  timestamp: '2026-09-08T21:18:43.120Z',
  start_timestamp: '2026-09-08T21:18:43.120Z',
  initial_timestamp: '2026-09-08T21:18:43.120Z',
  value: '1.72',
  current_amount: '0x1',
  original_amount: '0x1',
  qualifying_amount: '0x1',
  qualification_timestamp: '2026-09-08T21:23:43.120Z',
  is_qualified: false,
  is_disqualified: false,
  ...over,
})

const claimedR1 = (over: Record<string, unknown> = {}) =>
  entry({
    is_qualified: true,
    status: 'CLAIMED',
    expiration_timestamp: '2099-10-31T22:00:00.000Z',
    round2: { uuid: R2_UUID, spawned_timestamp: '2026-09-08T21:25:22.861Z' },
    ...over,
  })

const entryR2 = (over: Record<string, unknown> = {}) =>
  entry({
    uuid: R2_UUID,
    round: 2,
    parent_uuid: R1_UUID,
    start_timestamp: '2026-09-08T21:25:21.460Z',
    qualification_timestamp: '2026-09-08T21:30:21.460Z',
    ...over,
  })

const seasonTwo = (over: Partial<RwaInfoResponse['info']> = {}) =>
  season({
    rounds: 2,
    rewards: [{ id: USDC_ETH, amount: '0x989680' }], // 10 USDC @ 6 decimals
    round2: {
      days_to_hold: 5,
      days_to_claim: 14,
      rewards: [{ id: USDC_ETH, amount: '0xf4240' }], // 1 USDC @ 6 decimals
    },
    ...over,
  })

const load = async (body: RwaInfoResponse) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok(body)))
  const store = useHoldingsStore()
  await store.fetchInfo(ADDRESS)
  return store
}

describe('holdingsStore — round 2', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps holding after the round-1 claim, on the round-2 entry', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        claimed: [claimedR1()],
        pending: [entryR2()],
        round2: {
          eligible: true,
          status: 'PENDING',
          uuid: R2_UUID,
          parent_uuid: R1_UUID,
          start_timestamp: '2026-09-08T21:25:21.460Z',
          qualification_timestamp: '2026-09-08T21:30:21.460Z',
          complete: false,
        },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('holding')
    expect(store.activeReward?.uuid).toBe(R2_UUID)
    expect(store.isRoundTwoActive).toBe(true)
    // The round-2 tracker length is the server's, not the round-1 constant.
    expect(store.holdTotalDays).toBe(5)
    // No new-trade invitations during or after round 2.
    expect(store.canRetryTrade).toBe(false)
  })

  it('offers the round-2 claim on QUALIFIED, against the round-2 uuid', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        claimed: [claimedR1()],
        qualified: [
          entryR2({
            is_qualified: true,
            expiration_timestamp: '2099-09-22T21:30:21.460Z',
          }),
        ],
        round2: {
          eligible: true,
          status: 'QUALIFIED',
          uuid: R2_UUID,
          parent_uuid: R1_UUID,
          expiration_timestamp: '2099-09-22T21:30:21.460Z',
          complete: false,
        },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('earned')
    // What the claim signs — the round-2 uuid, never the round-1 one.
    expect(store.activeReward?.uuid).toBe(R2_UUID)
    // The round-2 amount comes from `info.round2.rewards`, never round 1's.
    expect(store.rewardAmountLabel).toBe('1 USDC')
  })

  it('reads QUALIFIED past its deadline as expired, before the server flips it', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        claimed: [claimedR1()],
        qualified: [
          entryR2({
            is_qualified: true,
            expiration_timestamp: '2020-01-01T00:00:00.000Z',
          }),
        ],
        round2: {
          eligible: true,
          status: 'QUALIFIED',
          uuid: R2_UUID,
          expiration_timestamp: '2020-01-01T00:00:00.000Z',
          complete: false,
        },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('expired')
    expect(store.isRoundTwoActive).toBe(true)
  })

  it('shows the loss when round 2 is disqualified — round 1 stays claimed underneath', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        claimed: [claimedR1()],
        disqualified: [
          entryR2({
            current_amount: '0',
            is_disqualified: true,
            disqualified_reason: 'sold_off_no_balance',
            disqualified_timestamp: '2026-09-08T21:28:51.692Z',
          }),
        ],
        round2: {
          eligible: true,
          status: 'DISQUALIFIED',
          uuid: R2_UUID,
          parent_uuid: R1_UUID,
          complete: false,
        },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('lost')
    expect(store.activeReward?.uuid).toBe(R2_UUID)
    expect(store.isRoundTwoActive).toBe(true)
    // Terminal — no retry, no round 3.
    expect(store.canRetryTrade).toBe(false)
  })

  it('settles on claimed once round 2 completes', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        claimed: [
          claimedR1(),
          entryR2({ is_qualified: true, status: 'CLAIMED' }),
        ],
        round2: {
          eligible: true,
          status: 'CLAIMED',
          uuid: R2_UUID,
          complete: true,
        },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('claimed')
    expect(store.activeReward?.uuid).toBe(R2_UUID)
    expect(store.isRoundTwoActive).toBe(true)
  })

  it('keeps the claimed round-1 view when the pool ran out of a second round', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        claimed: [
          claimedR1({
            round2: { skipped: 'BUDGET', skipped_timestamp: '2026-09-08' },
          }),
        ],
        round2: {
          eligible: true,
          status: 'UNAVAILABLE',
          unavailable_reason: 'BUDGET',
          complete: false,
        },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('claimed')
    expect(store.activeReward?.uuid).toBe(R1_UUID)
    expect(store.isRoundTwoActive).toBe(false)
    expect(store.round2Status).toBe('UNAVAILABLE')
  })

  it('treats a season-1 response (no round2 anywhere) exactly as before', async () => {
    const store = await load(
      campaignBody({
        claimed: [
          entry({
            round: undefined,
            is_qualified: true,
            status: 'CLAIMED',
          }),
        ],
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('claimed')
    expect(store.round2Status).toBeNull()
    expect(store.holdTotalDays).toBe(14)
  })

  it('round 1 shows its own reward amount from info.rewards', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        pending: [entry()],
        round2: { eligible: false, status: 'NOT_ELIGIBLE', complete: false },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('holding')
    expect(store.isRoundTwoActive).toBe(false)
    expect(store.rewardAmountLabel).toBe('10 USDC')
  })

  // The reported bug: two qualifying trades on different assets, claim one —
  // the other stays `qualified` server-side (its hold completed), but "one
  // reward per customer" means claiming it would only ever 409. No Claim
  // button may survive the first claim.
  describe('a second round-1 entry on another asset', () => {
    const B_UUID = 'bbbbbbbb-0000-4000-8000-000000000bbb'
    const qualifiedB = () =>
      entry({
        uuid: B_UUID,
        id: 'rwa:MSFT',
        is_qualified: true,
        expiration_timestamp: '2099-10-31T22:00:00.000Z',
      })

    it('stops being claimable the moment the first reward is claimed', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1()],
          qualified: [qualifiedB()],
          pending: [entryR2()],
          round2: {
            eligible: true,
            status: 'PENDING',
            uuid: R2_UUID,
            parent_uuid: R1_UUID,
            qualification_timestamp: '2099-09-08T21:30:21.460Z',
            complete: false,
          },
        } as unknown as Partial<RwaInfoResponse>),
      )

      // The claimed entry's round 2 owns the card — not asset B's dead claim.
      expect(store.status).toBe('holding')
      expect(store.activeReward?.uuid).toBe(R2_UUID)
      expect(store.isRoundTwoActive).toBe(true)
    })

    it('stays on the round-2 story after the other asset is traded away', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1()],
          disqualified: [
            entry({
              uuid: B_UUID,
              id: 'rwa:MSFT',
              current_amount: '0',
              is_disqualified: true,
              disqualified_reason: 'sold_off_no_balance',
            }),
          ],
          pending: [entryR2()],
          round2: {
            eligible: true,
            status: 'PENDING',
            uuid: R2_UUID,
            parent_uuid: R1_UUID,
            qualification_timestamp: '2099-09-08T21:30:21.460Z',
            complete: false,
          },
        } as unknown as Partial<RwaInfoResponse>),
      )

      // Selling the unrelated asset neither loses the offer nor revives a
      // Claim button; round 2 keeps holding.
      expect(store.status).toBe('holding')
      expect(store.activeReward?.uuid).toBe(R2_UUID)
    })

    it('claims round 2 — not the leftover sibling — once QUALIFIED', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1()],
          qualified: [
            qualifiedB(),
            entryR2({
              is_qualified: true,
              expiration_timestamp: '2099-09-22T21:30:21.460Z',
            }),
          ],
          round2: {
            eligible: true,
            status: 'QUALIFIED',
            uuid: R2_UUID,
            expiration_timestamp: '2099-09-22T21:30:21.460Z',
            complete: false,
          },
        } as unknown as Partial<RwaInfoResponse>),
      )

      expect(store.status).toBe('earned')
      expect(store.activeReward?.uuid).toBe(R2_UUID)
    })

    it('refuses to sign a second round-1 claim locally', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1()],
          qualified: [qualifiedB()],
          round2: { eligible: true, status: 'UNAVAILABLE', complete: false },
        } as unknown as Partial<RwaInfoResponse>),
      )

      const { useWalletStore } = await import('@/stores/walletStore')
      const walletStore = useWalletStore()
      const sign = vi.fn(async () => '0xsigned')
      // @ts-expect-error minimal signer stub for the claim path
      walletStore.wallet = {
        getAddress: async () => ADDRESS,
        SignMessage: sign,
      }

      // Even if some surface hands over the dead sibling entry, the store
      // refuses before asking for a signature or hitting the server.
      const leftover = store.qualified.find(r => r.uuid === B_UUID)!
      const result = await store.claim(leftover)

      expect(result).toEqual({ success: false, errorKey: 'alreadyClaimed' })
      expect(sign).not.toHaveBeenCalled()
      const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>
      expect(
        fetchMock.mock.calls.some(c => String(c[0]).includes('/claim')),
      ).toBe(false)
    })

    it('never revives a Claim button when a legacy dismissal hid only the claimed entry', async () => {
      // The old "Hide this offer" stored just the visible uuid. Hiding the
      // claimed entry must hide the whole spent offer — not promote the
      // leftover sibling back to claimable.
      localStorage.setItem('mew-rwa-dismissed', JSON.stringify([R1_UUID]))
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1()],
          qualified: [qualifiedB()],
          round2: { eligible: true, status: 'UNAVAILABLE', complete: false },
        } as unknown as Partial<RwaInfoResponse>),
      )

      expect(store.status).toBe('default')
      expect(store.activeReward).toBeNull()
      expect(store.isHoldOfferDismissed).toBe(true)
    })

    it('dismissOffer hides the leftover sibling too', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [
            claimedR1(),
            entryR2({ is_qualified: true, status: 'CLAIMED' }),
          ],
          qualified: [qualifiedB()],
          round2: {
            eligible: true,
            status: 'CLAIMED',
            uuid: R2_UUID,
            complete: true,
          },
        } as unknown as Partial<RwaInfoResponse>),
      )

      expect(store.status).toBe('claimed')
      store.dismissOffer()

      // Nothing resurfaces — least of all asset B's dead Claim button.
      expect(store.status).toBe('default')
      expect(store.isHoldOfferDismissed).toBe(true)
    })
  })

  it('dismissOffer hides both rounds at once', async () => {
    const store = await load(
      campaignBody({
        info: seasonTwo(),
        metas,
        claimed: [
          claimedR1(),
          entryR2({ is_qualified: true, status: 'CLAIMED' }),
        ],
        round2: {
          eligible: true,
          status: 'CLAIMED',
          uuid: R2_UUID,
          complete: true,
        },
      } as unknown as Partial<RwaInfoResponse>),
    )

    expect(store.status).toBe('claimed')
    store.dismissOffer()

    // Neither round's terminal state resurfaces, and the hero card is told to
    // hand the slot to the next offer.
    expect(store.status).toBe('default')
    expect(store.isHoldOfferDismissed).toBe(true)
  })

  it('a claim response keeps the round2 summary it just created', async () => {
    // Start qualified on round 1.
    const infoBody = campaignBody({
      info: seasonTwo(),
      metas,
      qualified: [
        entry({
          is_qualified: true,
          expiration_timestamp: '2099-10-31T22:00:00.000Z',
        }),
      ],
      round2: { eligible: false, status: 'NOT_ELIGIBLE', complete: false },
    } as unknown as Partial<RwaInfoResponse>)

    // The claim answer is what spawns round 2 — the summary must survive the
    // merge, not wait for the next poll.
    const claimBody = {
      msg: 'ok',
      uuid: R1_UUID,
      claim: {},
      info: seasonTwo(),
      metas,
      qualified: [],
      disqualified: [],
      claimed: [claimedR1()],
      pending: [entryR2()],
      round2: {
        eligible: true,
        status: 'PENDING',
        uuid: R2_UUID,
        parent_uuid: R1_UUID,
        qualification_timestamp: '2099-09-08T21:30:21.460Z',
        complete: false,
      },
    }

    const fetchMock = vi
      .fn()
      .mockImplementation((url: string) =>
        Promise.resolve(
          String(url).includes('/claim') ? ok(claimBody) : ok(infoBody),
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    const store = useHoldingsStore()
    await store.fetchInfo(ADDRESS)
    expect(store.status).toBe('earned')

    const { useWalletStore } = await import('@/stores/walletStore')
    const walletStore = useWalletStore()
    // @ts-expect-error minimal signer stub for the claim path
    walletStore.wallet = {
      getAddress: async () => ADDRESS,
      SignMessage: async () => '0xsigned',
    }

    const result = await store.claim(store.activeReward!)
    expect(result.success).toBe(true)

    // What was actually signed and sent must be the ROUND-1 uuid here.
    const claimCall = fetchMock.mock.calls.find(c =>
      String(c[0]).includes('/claim'),
    )!
    const { transaction } = JSON.parse(String(claimCall[1].body))
    expect(JSON.parse(atob(transaction))).toEqual({
      uuid: R1_UUID,
      platform: 'web',
    })
    expect(store.status).toBe('holding')
    expect(store.activeReward?.uuid).toBe(R2_UUID)
    expect(store.isRoundTwoActive).toBe(true)
  })

  // One claim per round, round 2 included: with a round-2 claim on the books,
  // another round-2 entry (a second track from another asset) must never show
  // holding progress or a Claim button — the season is over for this wallet.
  describe('a second round-2 entry after the round-2 claim', () => {
    const R2B_UUID = 'cccccccc-0000-4000-8000-000000000ccc'
    const otherTrackR2 = (over: Record<string, unknown> = {}) =>
      entryR2({
        uuid: R2B_UUID,
        id: 'rwa:MSFT',
        parent_uuid: undefined,
        ...over,
      })
    const claimedRoundTwo = () =>
      entryR2({ is_qualified: true, status: 'CLAIMED' })

    it('stays claimed while the other round-2 entry is pending', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1(), claimedRoundTwo()],
          pending: [otherTrackR2()],
          round2: {
            eligible: true,
            status: 'PENDING',
            uuid: R2B_UUID,
            qualification_timestamp: '2099-09-08T21:30:21.460Z',
            complete: false,
          },
        } as unknown as Partial<RwaInfoResponse>),
      )

      expect(store.status).toBe('claimed')
      expect(store.activeReward?.uuid).toBe(R2_UUID)
      expect(store.isRoundTwoActive).toBe(true)
    })

    it('shows no Claim button when the other round-2 entry qualifies', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1(), claimedRoundTwo()],
          qualified: [
            otherTrackR2({
              is_qualified: true,
              expiration_timestamp: '2099-09-22T21:30:21.460Z',
            }),
          ],
          round2: {
            eligible: true,
            status: 'QUALIFIED',
            uuid: R2B_UUID,
            expiration_timestamp: '2099-09-22T21:30:21.460Z',
            complete: false,
          },
        } as unknown as Partial<RwaInfoResponse>),
      )

      // Not 'earned' — the round-2 reward was already claimed.
      expect(store.status).toBe('claimed')
      expect(store.activeReward?.uuid).toBe(R2_UUID)
    })

    it('refuses to sign a second round-2 claim locally', async () => {
      const store = await load(
        campaignBody({
          info: seasonTwo(),
          metas,
          claimed: [claimedR1(), claimedRoundTwo()],
          qualified: [
            otherTrackR2({
              is_qualified: true,
              expiration_timestamp: '2099-09-22T21:30:21.460Z',
            }),
          ],
          round2: {
            eligible: true,
            status: 'QUALIFIED',
            uuid: R2B_UUID,
            expiration_timestamp: '2099-09-22T21:30:21.460Z',
            complete: false,
          },
        } as unknown as Partial<RwaInfoResponse>),
      )

      const { useWalletStore } = await import('@/stores/walletStore')
      const walletStore = useWalletStore()
      const sign = vi.fn(async () => '0xsigned')
      // @ts-expect-error minimal signer stub for the claim path
      walletStore.wallet = {
        getAddress: async () => ADDRESS,
        SignMessage: sign,
      }

      const leftover = store.qualified.find(r => r.uuid === R2B_UUID)!
      const result = await store.claim(leftover)

      expect(result).toEqual({ success: false, errorKey: 'alreadyClaimed' })
      expect(sign).not.toHaveBeenCalled()
    })
  })

  it('reclaims: the round-2 claim signs the round-2 uuid and completes the season', async () => {
    // Round 2 qualified — the state the second Claim button renders from.
    const infoBody = campaignBody({
      info: seasonTwo(),
      metas,
      claimed: [claimedR1()],
      qualified: [
        entryR2({
          is_qualified: true,
          expiration_timestamp: '2099-09-22T21:30:21.460Z',
        }),
      ],
      round2: {
        eligible: true,
        status: 'QUALIFIED',
        uuid: R2_UUID,
        parent_uuid: R1_UUID,
        expiration_timestamp: '2099-09-22T21:30:21.460Z',
        complete: false,
      },
    } as unknown as Partial<RwaInfoResponse>)

    // The claim answer per the API doc: both entries claimed, summary CLAIMED.
    const claimBody = {
      msg: 'ok',
      uuid: R2_UUID,
      claim: {},
      info: seasonTwo(),
      metas,
      qualified: [],
      disqualified: [],
      claimed: [
        claimedR1(),
        entryR2({
          is_qualified: true,
          status: 'CLAIMED',
          claim: { round: 2, reward: { round: 2 } },
        }),
      ],
      pending: [],
      round2: {
        eligible: true,
        status: 'CLAIMED',
        uuid: R2_UUID,
        parent_uuid: R1_UUID,
        complete: true,
      },
    }

    const fetchMock = vi
      .fn()
      .mockImplementation((url: string) =>
        Promise.resolve(
          String(url).includes('/claim') ? ok(claimBody) : ok(infoBody),
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    const store = useHoldingsStore()
    await store.fetchInfo(ADDRESS)

    // The Claim button is offered again after the first claim...
    expect(store.status).toBe('earned')
    expect(store.isRoundTwoActive).toBe(true)

    const { useWalletStore } = await import('@/stores/walletStore')
    const walletStore = useWalletStore()
    // @ts-expect-error minimal signer stub for the claim path
    walletStore.wallet = {
      getAddress: async () => ADDRESS,
      SignMessage: async () => '0xsigned',
    }

    const result = await store.claim(store.activeReward!)
    expect(result.success).toBe(true)

    // ...and what it signs is the ROUND-2 uuid — never the round-1 one, never
    // parent_uuid.
    const claimCall = fetchMock.mock.calls.find(c =>
      String(c[0]).includes('/claim'),
    )!
    const { transaction } = JSON.parse(String(claimCall[1].body))
    expect(JSON.parse(atob(transaction))).toEqual({
      uuid: R2_UUID,
      platform: 'web',
    })

    // Season over: both rewards paid, nothing follows.
    expect(store.status).toBe('claimed')
    expect(store.round2Status).toBe('CLAIMED')
    expect(store.round2Summary?.complete).toBe(true)
  })
})
