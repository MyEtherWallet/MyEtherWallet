import {
  type WalletConfig,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'

export const WALLET_TABS = [
  'popular',
  'hardware',
  'mobile',
  'advanced',
] as const
export type WalletTab = (typeof WALLET_TABS)[number]

export type WalletStatus = 'recent' | 'detected' | 'official'
export interface TabWallet {
  wallet: WalletConfig
  status?: WalletStatus
}

/**
 * Curated wallets per tab, in Figma order (Onboarding › 3201:43865). Ids are
 * RainbowKit ids for RainbowKit wallets and `walletConfigs` keys otherwise.
 */
const TAB_WALLET_IDS: Record<WalletTab, string[]> = {
  popular: [
    'phantom',
    'mew',
    'enkrypt',
    'metaMask',
    'coinbase',
    'walletConnect',
    'trust',
    'rainbow',
  ],
  hardware: ['ledger', 'trezor'],
  mobile: [
    'mew',
    'walletConnect',
    'bitget',
    'bybit',
    'clv',
    'core',
    'trust',
    'rainbow',
  ],
  advanced: ['privateKey', 'mnemonic', 'keystore'],
}

/** Search pool per tab: Popular leaves out hardware and advanced methods. */
const inSearchPool = (tab: WalletTab, wallet: WalletConfig): boolean => {
  if (tab === 'hardware') return wallet.type.includes(WalletConfigType.HARDWARE)
  if (tab === 'mobile') return wallet.type.includes(WalletConfigType.MOBILE)
  return !wallet.type.some(
    type =>
      type === WalletConfigType.HARDWARE || type === WalletConfigType.SOFTWARE,
  )
}

/** RainbowKit connectors keep their wallet id in `rkDetails`; static configs use `id`. */
export const walletKey = (wallet: WalletConfig): string =>
  (wallet as WalletConfig & { rkDetails?: { id?: string } }).rkDetails?.id ??
  wallet.id

interface SelectInput {
  /** Wallets usable on the selected chain, already de-duplicated. */
  wallets: WalletConfig[]
  tab: WalletTab
  search?: string
  /** Most recent first. */
  recentNames: string[]
  /** EIP-6963 provider names. */
  detectedNames: string[]
}

export const selectTabWallets = ({
  wallets,
  tab,
  search = '',
  recentNames,
  detectedNames,
}: SelectInput): TabWallet[] => {
  const lower = (s: string) => s.toLowerCase()
  const recent = recentNames.map(lower)
  const detected = new Set(detectedNames.map(lower))
  const statusOf = (wallet: WalletConfig): WalletStatus | undefined => {
    if (recent.includes(lower(wallet.name))) return 'recent'
    if (detected.has(lower(wallet.name))) return 'detected'
    return wallet.isOfficial ? 'official' : undefined
  }
  const withStatus = (wallet: WalletConfig): TabWallet => ({
    wallet,
    status: statusOf(wallet),
  })

  const query = lower(search.trim())
  if (query && tab !== 'advanced') {
    const pool = wallets.filter(w => inSearchPool(tab, w))
    const starts = pool.filter(w => lower(w.name).startsWith(query))
    const contains = pool.filter(
      w => !lower(w.name).startsWith(query) && lower(w.name).includes(query),
    )
    return [...starts, ...contains].map(withStatus)
  }

  // First entry wins: static configs come first, so the Ledger device keeps the
  // 'ledger' slot even though Ledger Mobile inherits rkDetails.id === 'ledger'.
  const byKey = new Map<string, WalletConfig>()
  wallets.forEach(w => {
    if (!byKey.has(walletKey(w))) byKey.set(walletKey(w), w)
  })
  const curated = TAB_WALLET_IDS[tab]
    .map(id => byKey.get(id))
    .filter((w): w is WalletConfig => !!w)
  if (tab !== 'popular') return curated.map(withStatus)

  const recentFirst = wallets
    .filter(w => statusOf(w) === 'recent')
    .sort(
      (a, b) => recent.indexOf(lower(a.name)) - recent.indexOf(lower(b.name)),
    )
  const detectedNext = wallets.filter(
    w => statusOf(w) === 'detected' && inSearchPool('popular', w),
  )
  const defaults = wallets.filter(w => w.isDefault)
  const seen = new Set<string>()
  return [...recentFirst, ...detectedNext, ...curated, ...defaults]
    .filter(w => {
      const key = lower(w.name)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map(withStatus)
}
