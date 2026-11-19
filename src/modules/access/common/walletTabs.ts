import {
  type WalletConfig,
  WalletConfigType,
} from '@/modules/access/common/walletConfigs'

export const WALLET_TABS = [
  'popular',
  'hardware',
  'mobile',
  'extension',
  'advanced',
] as const
export type WalletTab = (typeof WALLET_TABS)[number]

export type WalletStatus = 'recent' | 'detected' | 'official'
const STATUS_ORDER: WalletStatus[] = ['recent', 'detected', 'official']
export interface TabWallet {
  wallet: WalletConfig
  status?: WalletStatus
}

/**
 * Curated wallets per tab, in Figma order (Onboarding › 3201:43865). Ids are
 * RainbowKit ids for RainbowKit wallets and `walletConfigs` keys otherwise.
 * Extension isn't curated: it lists extension-only and installed wallets.
 */
const TAB_WALLET_IDS: Record<Exclude<WalletTab, 'extension'>, string[]> = {
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

/** Popular leaves out hardware and advanced methods. */
const isAppWallet = (wallet: WalletConfig): boolean =>
  !wallet.type.some(
    type =>
      type === WalletConfigType.HARDWARE || type === WalletConfigType.SOFTWARE,
  )

/**
 * The names among values that come from outside the app: wallets announced
 * by browser extensions, and what localStorage hands back. Anything that is
 * not a name is dropped here, so the lists built from them cannot break on it.
 */
export const walletNames = (values: unknown[]): string[] =>
  values.filter(
    (value): value is string => typeof value === 'string' && value !== '',
  )

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

  // Search spans every tab, so the open one doesn't matter.
  const query = lower(search.trim())
  if (query) {
    const starts = wallets.filter(w => lower(w.name).startsWith(query))
    const contains = wallets.filter(
      w => !lower(w.name).startsWith(query) && lower(w.name).includes(query),
    )
    return [...starts, ...contains].map(withStatus)
  }

  // Extension-only wallets: those with a mobile app too (MetaMask, Trust, ...)
  // only when installed. Labelled ones (recent, detected, official) first, then A-Z.
  if (tab === 'extension') {
    const isExtension = (w: WalletConfig) =>
      w.type.includes(WalletConfigType.EXTENSION) &&
      (!w.type.includes(WalletConfigType.MOBILE) || detected.has(lower(w.name)))
    const rank = ({ status }: TabWallet) =>
      status ? STATUS_ORDER.indexOf(status) : STATUS_ORDER.length
    return wallets
      .filter(isExtension)
      .map(withStatus)
      .sort(
        (a, b) =>
          rank(a) - rank(b) || a.wallet.name.localeCompare(b.wallet.name),
      )
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
    w => statusOf(w) === 'detected' && isAppWallet(w),
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

/**
 * The wallets that follow the detected and the most recent wallet in the
 * Log in / Sign Up view's row: MEW's own two, then the two key methods
 * (design, 2026-11-19). `walletConfigs` keys.
 */
const SIGN_UP_ROW_IDS = ['mew', 'enkrypt', 'privateKey', 'keystore']
/** Wallet tiles in that row; one more tile leads to every other method. */
export const SIGN_UP_ROW_SIZE = 4

/**
 * The wallet tiles of the Log in / Sign Up view, in order: the installed
 * wallet the browser reports, the wallet used most recently, MEW Mobile,
 * Enkrypt, Private Key, Keystore — each once, as far as the row goes.
 *
 * That one rule gives design's three cases: with a detected and a recent
 * wallet the row ends at Enkrypt; with only a detected one it reaches
 * Private Key; with neither it reaches Keystore. On a chain that has fewer of
 * them (Bitcoin) the row is filled from the Popular list.
 */
export const selectSignUpRowWallets = ({
  wallets,
  recentNames,
  detectedNames,
}: Omit<SelectInput, 'tab' | 'search'>): WalletConfig[] => {
  const lower = (s: string) => s.toLowerCase()
  const byName = new Map<string, WalletConfig>()
  const byKey = new Map<string, WalletConfig>()
  // First entry wins, as in the tabs: static configs come first.
  wallets.forEach(w => {
    if (!byName.has(lower(w.name))) byName.set(lower(w.name), w)
    if (!byKey.has(walletKey(w))) byKey.set(walletKey(w), w)
  })
  /** The first of these names that is a wallet of the selected chain. */
  const firstNamed = (names: string[]): WalletConfig | undefined =>
    names.map(name => byName.get(lower(name))).find(w => w !== undefined)

  const popular = selectTabWallets({
    wallets,
    tab: 'popular',
    recentNames,
    detectedNames,
  }).map(entry => entry.wallet)

  const seen = new Set<string>()
  return [
    firstNamed(detectedNames),
    firstNamed(recentNames),
    ...SIGN_UP_ROW_IDS.map(id => byKey.get(id)),
    ...popular,
  ]
    .filter((w): w is WalletConfig => {
      if (!w || seen.has(lower(w.name))) return false
      seen.add(lower(w.name))
      return true
    })
    .slice(0, SIGN_UP_ROW_SIZE)
}
