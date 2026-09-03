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

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body })
const fail = (status: number, body: unknown = {}) =>
  ({ ok: false, status, json: async () => body })

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
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(ok({ info: season() })),
    )

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
      const fetchMock = vi.fn().mockImplementation((url: string) =>
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
      const fetchMock = vi.fn().mockImplementation((url: string) =>
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
            ? ok(campaignBody({ info: season({ end: '2100-06-01T00:00:00Z' }) }))
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
      vi.fn().mockImplementation((url: string) =>
        Promise.resolve(
          String(url).includes('address') ? fail(403, body) : ok(campaignBody()),
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
        vi.fn().mockImplementation((url: string) =>
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
