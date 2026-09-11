export type RouteNameCollection = {
  [key: string]: RouteName
}
export type RouteName = {
  NAME: string
  PATH: string
}

const ROUTES_MAIN: RouteNameCollection = {
  HOME: { NAME: 'Home', PATH: '/' },
  //A-Z
  BUY: { NAME: 'Buy', PATH: '/buy-and-sell' },
  PRINT: { NAME: 'PrintPaperWallet', PATH: '/print-wallet' },
  SIGN_MESSAGE: { NAME: 'SignMessage', PATH: '/sign' },
  SETTINGS: { NAME: 'Settings', PATH: '/settings' },
  EARN: { NAME: 'Earn', PATH: '/earn' },
  PERPS: { NAME: 'Perps', PATH: '/perps' },
  SWAP: { NAME: 'Swap', PATH: '/swap' },
  VERIFY_MESSAGE: { NAME: 'VerifyMessage', PATH: '/verify' },
  CRYPTO: { NAME: 'Crypto', PATH: '/crypto' },
  LEARN: { NAME: 'Learn', PATH: '/learn' },
  STOCKS: { NAME: 'Stocks', PATH: '/stocks' },
  PORTFOLIO: { NAME: 'Portfolio', PATH: '/portfolio' },
}

/**
 * Canonical connect / create-wallet routes. Both PATHs are RELATIVE so the records can
 * nest under any host page (see routesWalletFlow.ts); hosted by Home (path '/') they
 * resolve to the standalone '/access' and '/create'.
 *
 * Deliberately un-annotated (no `: RouteNameCollection`): that type's index signature
 * lets a typo like `ROUTES_ACCESS.ACCESS_TREZOR.NAME` compile against a key that does
 * not exist. Inferring the literal type makes it a type error instead.
 */
const ROUTES_ACCESS = {
  ACCESS: { NAME: 'Access', PATH: 'access' },
}

const ROUTES_CREATE_WALLET = {
  CREATE_WALLET: { NAME: 'CreateWallet', PATH: 'create' },
}

type WalletFlowKind = 'access' | 'create'

const WALLET_FLOW_ROUTES: Record<
  WalletFlowKind,
  { PATH: string; SUFFIX: string }
> = {
  access: { PATH: ROUTES_ACCESS.ACCESS.PATH, SUFFIX: '-access' },
  create: { PATH: ROUTES_CREATE_WALLET.CREATE_WALLET.PATH, SUFFIX: '-create' },
}

const CANONICAL_WALLET_FLOW_NAME: Record<WalletFlowKind, string> = {
  access: ROUTES_ACCESS.ACCESS.NAME,
  create: ROUTES_CREATE_WALLET.CREATE_WALLET.NAME,
}

/**
 * Connect ("access") and create-wallet are modal overlays that can open on top of ANY
 * page, so one record per host page is generated (routesWalletFlow.ts). Home hosts the
 * canonical standalone pair — '/access' and '/create', names 'Access' and 'CreateWallet'
 * — and every other host gets a name suffixed from its own: 'Stocks' -> 'Stocks-access'.
 */
const walletFlowRouteName = (
  hostRouteName: string,
  kind: WalletFlowKind,
): string =>
  hostRouteName === ROUTES_MAIN.HOME.NAME
    ? CANONICAL_WALLET_FLOW_NAME[kind]
    : `${hostRouteName}${WALLET_FLOW_ROUTES[kind].SUFFIX}`

const TOKEN_INFO = { PATH: 'token/:tokenId' }
const TOKEN_INFO_ROUTE_NAMES = {
  crypto: 'token-info-crypto',
  home: 'token-info-home',
  stocks: 'token-info-stocks',
  earn: 'token-info-earn',
  verify: 'token-info-verify',
  sign: 'token-info-sign',
}
const STOCK_INFO = { PATH: 'stock/:symbol' }
const STOCK_INFO_ROUTE_NAMES = {
  home: 'home-stock-info',
  crypto: 'crypto-stock-info',
  stocks: 'stocks-stock-info',
  earn: 'earn-stock-info',
  verify: 'verify-stock-info',
  sign: 'sign-stock-info',
}
const PERP_INFO = { PATH: 'perp/:market' }
const PERP_INFO_ROUTE_NAME = 'perps-perp-info'

const ROUTES_SEND: RouteNameCollection = {
  SEND: { NAME: 'WalletSend', PATH: '/send' },
  SEND_NFT: { NAME: 'WalletSendNFT', PATH: 'nft' },

  //TO BE IMPLEMENTED OR DELETEDaa
  SEND_TX: { NAME: 'SendTX', PATH: 'send-tx' },
  SEND_TX_OFFLINE: { NAME: 'SendTXOffline', PATH: 'send-tx-offline' },
}

export {
  ROUTES_MAIN,
  ROUTES_CREATE_WALLET,
  ROUTES_SEND,
  ROUTES_ACCESS,
  WALLET_FLOW_ROUTES,
  walletFlowRouteName,
  TOKEN_INFO,
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO,
  STOCK_INFO_ROUTE_NAMES,
  PERP_INFO,
  PERP_INFO_ROUTE_NAME,
}
export type { WalletFlowKind }
