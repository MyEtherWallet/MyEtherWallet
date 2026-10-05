import { describe, it, expect, vi } from 'vitest'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    DESKTOP: 'desktop',
    EXTENSION: 'extension',
    MOCK: 'mock',
  },
}))

const { selectTabWallets, walletKey } =
  await import('@/modules/access/common/walletTabs')

type W = Parameters<typeof walletKey>[0]
const cfg = (id: string, name: string, type: string[], extra = {}): W =>
  ({ id, name, icon: '', type, ...extra }) as unknown as W
const rk = (rkId: string, name: string, type: string[]): W =>
  ({
    id: `${rkId}-connector`,
    name,
    icon: '',
    type,
    rkDetails: { id: rkId },
  }) as unknown as W

const POOL: W[] = [
  cfg('mew', 'MEW Mobile', ['mobile'], { isOfficial: true, isDefault: true }),
  cfg('enkrypt', 'Enkrypt', ['extension'], {
    isOfficial: true,
    isDefault: true,
  }),
  cfg('ledger', 'Ledger', ['hardware']),
  cfg('trezor', 'Trezor', ['hardware']),
  cfg('privateKey', 'Private Key', ['software']),
  cfg('mnemonic', 'Recovery (mnemonic) Phrase', ['software']),
  cfg('keystore', 'Keystore', ['software']),
  rk('phantom', 'Phantom', ['extension', 'mobile']),
  rk('metaMask', 'MetaMask', ['extension', 'mobile']),
  rk('coinbase', 'Coinbase Wallet', ['extension', 'mobile']),
  rk('walletConnect', 'WalletConnect', ['mobile']),
  rk('trust', 'Trust Wallet', ['extension', 'mobile']),
  rk('rainbow', 'Rainbow', ['extension', 'mobile']),
  rk('bitget', 'Bitget Wallet', ['extension', 'mobile']),
  rk('bybit', 'Bybit Wallet', ['extension', 'mobile']),
  rk('clv', 'CLV', ['extension', 'mobile']),
  rk('core', 'Core', ['extension', 'mobile']),
  rk('zerion', 'Zerion', ['extension', 'mobile']),
  rk('rabby', 'Rabby Wallet', ['extension']),
]

const names = (r: { wallet: W }[]) => r.map(x => x.wallet.name)
const base = { wallets: POOL, recentNames: [], detectedNames: [] }

describe('walletKey', () => {
  it('prefers the RainbowKit id over the connector id', () => {
    expect(walletKey(rk('metaMask', 'MetaMask', []))).toBe('metaMask')
    expect(walletKey(cfg('ledger', 'Ledger', []))).toBe('ledger')
  })
})

describe('selectTabWallets', () => {
  it('lists Popular in Figma order with status labels', () => {
    const r = selectTabWallets({ ...base, tab: 'popular' })
    expect(names(r)).toEqual([
      'Phantom',
      'MEW Mobile',
      'Enkrypt',
      'MetaMask',
      'Coinbase Wallet',
      'WalletConnect',
      'Trust Wallet',
      'Rainbow',
    ])
    expect(r.find(x => x.wallet.id === 'mew')?.status).toBe('official')
    expect(r.find(x => x.wallet.name === 'MetaMask')?.status).toBeUndefined()
  })

  it('lists Hardware, Mobile and Advanced curated sets', () => {
    expect(names(selectTabWallets({ ...base, tab: 'hardware' }))).toEqual([
      'Ledger',
      'Trezor',
    ])
    expect(names(selectTabWallets({ ...base, tab: 'mobile' }))).toEqual([
      'MEW Mobile',
      'WalletConnect',
      'Bitget Wallet',
      'Bybit Wallet',
      'CLV',
      'Core',
      'Trust Wallet',
      'Rainbow',
    ])
    expect(names(selectTabWallets({ ...base, tab: 'advanced' }))).toEqual([
      'Private Key',
      'Recovery (mnemonic) Phrase',
      'Keystore',
    ])
  })

  it('puts recent first, then detected, with Recent > Detected > Official', () => {
    const r = selectTabWallets({
      ...base,
      tab: 'popular',
      recentNames: ['Rainbow'],
      detectedNames: ['Phantom', 'rainbow'],
    })
    expect(names(r).slice(0, 2)).toEqual(['Rainbow', 'Phantom'])
    expect(r[0].status).toBe('recent')
    expect(r[1].status).toBe('detected')
    expect(names(r).filter(n => n === 'Rainbow')).toHaveLength(1)
  })

  it('appends detected wallets outside the curated list', () => {
    const r = selectTabWallets({
      ...base,
      tab: 'popular',
      detectedNames: ['Rabby Wallet'],
    })
    expect(r[0]).toMatchObject({
      wallet: { name: 'Rabby Wallet' },
      status: 'detected',
    })
  })

  it('appends default wallets missing from the curated list (Bitcoin case)', () => {
    const btcPool = [
      cfg('enkrypt', 'Enkrypt', ['extension'], {
        isOfficial: true,
        isDefault: true,
      }),
      cfg('unisat', 'UniSat', ['extension'], { isDefault: true }),
      cfg('mnemonic', 'Recovery (mnemonic) Phrase', ['software']),
    ]
    const r = selectTabWallets({ ...base, wallets: btcPool, tab: 'popular' })
    expect(names(r)).toEqual(['Enkrypt', 'UniSat'])
  })

  it('skips curated ids missing from the pool', () => {
    const pool = POOL.filter(w => w.name !== 'MetaMask' && w.name !== 'Trezor')
    expect(
      names(selectTabWallets({ ...base, wallets: pool, tab: 'popular' })),
    ).not.toContain('MetaMask')
    expect(
      names(selectTabWallets({ ...base, wallets: pool, tab: 'hardware' })),
    ).toEqual(['Ledger'])
  })

  it('searches every compatible wallet in Popular, prefix matches first', () => {
    expect(
      names(selectTabWallets({ ...base, tab: 'popular', search: 'ze' })),
    ).toEqual(['Zerion'])
    expect(
      names(selectTabWallets({ ...base, tab: 'popular', search: 'wallet' })),
    ).toEqual([
      'WalletConnect',
      'Coinbase Wallet',
      'Trust Wallet',
      'Bitget Wallet',
      'Bybit Wallet',
      'Rabby Wallet',
    ])
  })

  it('never returns advanced or hardware wallets from a Popular search', () => {
    expect(
      selectTabWallets({ ...base, tab: 'popular', search: 'key' }),
    ).toEqual([])
    expect(
      selectTabWallets({ ...base, tab: 'popular', search: 'ledger' }),
    ).toEqual([])
  })

  it('scopes Mobile and Hardware searches to their type', () => {
    expect(
      names(selectTabWallets({ ...base, tab: 'mobile', search: 'rabby' })),
    ).toEqual([])
    expect(
      names(selectTabWallets({ ...base, tab: 'mobile', search: 'zer' })),
    ).toEqual(['Zerion'])
    expect(
      names(selectTabWallets({ ...base, tab: 'hardware', search: 'tre' })),
    ).toEqual(['Trezor'])
  })

  it('ignores search on Advanced', () => {
    expect(
      selectTabWallets({ ...base, tab: 'advanced', search: 'zzz' }),
    ).toHaveLength(3)
  })
})
