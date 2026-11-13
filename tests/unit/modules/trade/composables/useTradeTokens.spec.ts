import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope, ref, type EffectScope } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mainnet, bsc, polygon } from 'viem/chains'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: () => ({
      get: () => ({ json: () => Promise.resolve({ data: ref(null) }) }),
    }),
  }),
}))

import { useTradeTokens } from '@/modules/trade/composables/useTradeTokens'
import { useTradeForm } from '@/modules/trade/composables/useTradeForm'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import type { NewTokenInfo } from '@/stores/swapStore'
import type {
  Chain,
  GetWebSwapOndoAssetsResponse,
  GetWebSwapOndoSupportingAssetsResponse,
} from '@/mew_api/types'

type TradableAsset = GetWebSwapOndoAssetsResponse[number]
type SupportingAsset = GetWebSwapOndoSupportingAssetsResponse[number]

const ADDRESS = {
  AAPL: { eth: '0x00000000000000000000000000000000000000a1', bsc: '0xb1' },
  BIG5: { eth: '0x00000000000000000000000000000000000000a2', bsc: '0xb2' },
  MAG7X: { eth: '0x00000000000000000000000000000000000000a3', bsc: '0xb3' },
  LEGACY: { eth: '0x00000000000000000000000000000000000000a4', bsc: '0xb4' },
  USDT: { eth: '0x00000000000000000000000000000000000000c1', bsc: '0xd1' },
  USDC: { eth: '0x00000000000000000000000000000000000000c2', bsc: '0xd2' },
  UNI: '0x00000000000000000000000000000000000000e9',
}

const tradable = (
  symbol: string,
  addresses: { eth: string; bsc: string },
  flag: { isPortfolio?: boolean | null } = {},
): TradableAsset =>
  ({
    symbol,
    ...flag,
    tradable: true,
    pause: null,
    primaryMarket: {
      price: '25',
      priceChangePercentage24h: '0',
      sharesMultiplier: '1',
      tradableSessions: [],
    },
    underlyingMarket: flag.isPortfolio ? null : { name: symbol, price: '25' },
    addresses: [
      {
        chainName: 'ETHEREUM',
        ondoGmNetworkChainId: 'eth',
        address: addresses.eth,
        decimals: 18,
      },
      {
        chainName: 'BSC',
        ondoGmNetworkChainId: 'bsc',
        address: addresses.bsc,
        decimals: 18,
      },
    ],
  }) as TradableAsset

const supporting = (
  symbol: string,
  addresses: { eth: string; bsc: string },
  flag: { isPortfolio?: boolean | null } = { isPortfolio: null },
): SupportingAsset =>
  ({
    coinId: symbol,
    name: symbol,
    symbol,
    price: 1,
    ...flag,
    addresses: [
      {
        chainName: 'ETHEREUM',
        tokenLogoUrl: null,
        address: addresses.eth,
        decimals: 6,
      },
      {
        chainName: 'BSC',
        tokenLogoUrl: null,
        address: addresses.bsc,
        decimals: 18,
      },
    ],
  }) as SupportingAsset

const flaggedAssets = () => [
  tradable('AAPLon', ADDRESS.AAPL, { isPortfolio: false }),
  tradable('BIG5on', ADDRESS.BIG5, { isPortfolio: true }),
  tradable('MAG7Xon', ADDRESS.MAG7X, { isPortfolio: true }),
  // An asset from a payload that predates the flag.
  tradable('LEGACYon', ADDRESS.LEGACY),
]
const stables = () => [
  supporting('usdt', ADDRESS.USDT),
  supporting('usdc', ADDRESS.USDC),
]

const ETHEREUM = { name: 'ETHEREUM', chainID: String(mainnet.id) } as Chain
const BNB = { name: 'BSC', chainID: String(bsc.id) } as Chain
// Same asset chain name, so the lists resolve, but an id the rules do not gate.
const UNGATED = { name: 'ETHEREUM', chainID: String(polygon.id) } as Chain

const token = (address: string, symbol = 'TKN') =>
  ({ address, symbol, decimals: 18, price: 1 }) as NewTokenInfo

let scope: EffectScope | undefined

const setup = (
  chain: Chain,
  assets: {
    tradable?: TradableAsset[]
    supporting?: SupportingAsset[]
  } = {},
) => {
  const form = useTradeForm(chain)
  scope = effectScope()
  const tokens = scope.run(() =>
    useTradeTokens({
      form,
      fromTokens: ref<NewTokenInfo[]>([]),
      tradableAssets: ref(assets.tradable ?? flaggedAssets()),
      additionalBuyAssets: ref(assets.supporting ?? stables()),
      hardcodedTokensInfo: ref([]),
      currentSession: ref('regular'),
    }),
  )!
  const symbols = () => tokens.toTokens.value.map(({ symbol }) => symbol)
  return { ...tokens, form, symbols }
}

describe('useTradeTokens OIP pair rules', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    scope?.stop()
    scope = undefined
  })

  describe.each([
    { label: 'Ethereum', chain: ETHEREUM, key: 'eth' as const },
    { label: 'BNB', chain: BNB, key: 'bsc' as const },
  ])('on $label', ({ chain, key }) => {
    it('offers only the stables when selling an OIP token', () => {
      const { form, symbols } = setup(chain)
      form.fromTokenSelected.value = token(ADDRESS.BIG5[key].toUpperCase())

      expect(symbols()).toEqual(['USDT', 'USDC'])
    })

    it('offers OIP tokens to a native From', () => {
      const { form, symbols } = setup(chain)
      form.fromTokenSelected.value = token(MAIN_TOKEN_CONTRACT)

      expect(symbols()).toEqual(['AAPLON', 'BIG5ON', 'MAG7XON', 'LEGACYON'])
    })

    it('offers OIP tokens to a stable From', () => {
      const { form, symbols } = setup(chain)
      form.fromTokenSelected.value = token(ADDRESS.USDT[key])

      expect(symbols()).toEqual(['AAPLON', 'BIG5ON', 'MAG7XON', 'LEGACYON'])
    })

    it('hides OIP tokens from a non-OIP stock token, keeping the rest', () => {
      const { form, symbols } = setup(chain)
      form.fromTokenSelected.value = token(ADDRESS.AAPL[key])

      expect(symbols()).toEqual(['AAPLON', 'LEGACYON', 'USDT', 'USDC'])
    })

    it('hides OIP tokens from any other ERC-20', () => {
      const { form, symbols } = setup(chain)
      form.fromTokenSelected.value = token(ADDRESS.UNI)

      expect(symbols()).toEqual(['AAPLON', 'LEGACYON'])
    })
  })

  it('leaves the list unfiltered until a From token is selected', () => {
    const { symbols } = setup(ETHEREUM)

    expect(symbols()).toEqual(['AAPLON', 'BIG5ON', 'MAG7XON', 'LEGACYON'])
  })

  it('flags an OIP trade with the OIP token on either side', () => {
    const { form, isOipTrade, isFromTokenStable } = setup(ETHEREUM)

    form.fromTokenSelected.value = token(ADDRESS.BIG5.eth)
    form.toTokenSelected.value = token(ADDRESS.USDT.eth)
    expect(isOipTrade.value).toBe(true)
    expect(isFromTokenStable.value).toBe(false)

    form.fromTokenSelected.value = token(ADDRESS.USDT.eth)
    form.toTokenSelected.value = token(ADDRESS.BIG5.eth)
    expect(isOipTrade.value).toBe(true)
    expect(isFromTokenStable.value).toBe(true)

    form.fromTokenSelected.value = token(MAIN_TOKEN_CONTRACT)
    form.toTokenSelected.value = token(ADDRESS.AAPL.eth)
    expect(isOipTrade.value).toBe(false)
    expect(isFromTokenStable.value).toBe(false)
  })

  it('refuses a pair that puts an OIP token against anything but cash', () => {
    const { form, isOipPairAllowed } = setup(ETHEREUM)
    form.toTokenSelected.value = token(ADDRESS.BIG5.eth)
    expect(isOipPairAllowed.value).toBe(true)

    form.fromTokenSelected.value = token(MAIN_TOKEN_CONTRACT)
    expect(isOipPairAllowed.value).toBe(true)

    form.fromTokenSelected.value = token(ADDRESS.UNI)
    expect(isOipPairAllowed.value).toBe(false)

    form.fromTokenSelected.value = token(ADDRESS.MAG7X.eth)
    expect(isOipPairAllowed.value).toBe(false)

    form.toTokenSelected.value = token(ADDRESS.USDC.eth)
    expect(isOipPairAllowed.value).toBe(true)
  })

  it('recognises an OIP symbol the current From has filtered out', () => {
    const { form, symbols, isOipSymbol, isCashToken } = setup(ETHEREUM)
    form.fromTokenSelected.value = token(ADDRESS.UNI)

    expect(symbols()).not.toContain('BIG5ON')
    expect(isOipSymbol('big5on')).toBe(true)
    expect(isOipSymbol('AAPLon')).toBe(false)
    expect(isOipSymbol('NOPE')).toBe(false)

    expect(isCashToken(token(MAIN_TOKEN_CONTRACT))).toBe(true)
    expect(isCashToken(token(ADDRESS.USDC.eth))).toBe(true)
    expect(isCashToken(token(ADDRESS.UNI))).toBe(false)
    expect(isCashToken(token(ADDRESS.BIG5.eth))).toBe(false)
    expect(isCashToken(null)).toBe(false)
  })

  it('applies nothing on a chain id the rules do not gate', () => {
    const { form, symbols, isOipTrade, isOipPairAllowed, isOipSymbol } =
      setup(UNGATED)

    form.fromTokenSelected.value = token(ADDRESS.BIG5.eth)
    form.toTokenSelected.value = token(ADDRESS.MAG7X.eth)
    expect(symbols()).toEqual([
      'AAPLON',
      'BIG5ON',
      'MAG7XON',
      'LEGACYON',
      'USDT',
      'USDC',
    ])
    expect(isOipTrade.value).toBe(false)
    expect(isOipPairAllowed.value).toBe(true)
    expect(isOipSymbol('BIG5on')).toBe(false)

    form.fromTokenSelected.value = token(ADDRESS.UNI)
    expect(symbols()).toEqual(['AAPLON', 'BIG5ON', 'MAG7XON', 'LEGACYON'])
  })

  it.each([
    { label: 'missing', flag: {} },
    { label: 'null', flag: { isPortfolio: null } },
    { label: 'false', flag: { isPortfolio: false } },
  ])('applies nothing when the flag is $label on every asset', ({ flag }) => {
    const { form, symbols, isOipTrade, isOipPairAllowed } = setup(ETHEREUM, {
      tradable: [
        tradable('AAPLon', ADDRESS.AAPL, flag),
        tradable('BIG5on', ADDRESS.BIG5, flag),
      ],
      supporting: [supporting('usdt', ADDRESS.USDT, flag)],
    })

    form.fromTokenSelected.value = token(ADDRESS.BIG5.eth)
    form.toTokenSelected.value = token(ADDRESS.AAPL.eth)
    expect(symbols()).toEqual(['AAPLON', 'BIG5ON', 'USDT'])
    expect(isOipTrade.value).toBe(false)
    expect(isOipPairAllowed.value).toBe(true)

    form.fromTokenSelected.value = token(ADDRESS.UNI)
    expect(symbols()).toEqual(['AAPLON', 'BIG5ON'])
  })
})
