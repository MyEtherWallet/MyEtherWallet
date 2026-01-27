export type RouteNameCollection = {
  [key: string]: RouteName
}
export type RouteName = {
  NAME: string
  PATH: string
}

const ROUTES_ACCESS: RouteNameCollection = {
  ACCESS: { NAME: 'Access', PATH: 'access' },
}

const ROUTES_CREATE_WALLET: RouteNameCollection = {
  CREATE_WALLET: { NAME: 'CreateWallet', PATH: '/create' },
}

const ROUTES_MAIN: RouteNameCollection = {
  HOME: { NAME: 'Home', PATH: '/' },
  //A-Z
  BUY: { NAME: 'Buy', PATH: '/buy-and-sell' },
  PRINT: { NAME: 'PrintPaperWallet', PATH: '/print-wallet' },
  SIGN_MESSAGE: { NAME: 'SignMessage', PATH: '/sign' },
  SETTINGS: { NAME: 'Settings', PATH: '/settings' },
  EARN: { NAME: 'Earn', PATH: '/earn' },
  SWAP: { NAME: 'Swap', PATH: '/swap' },
  VERIFY_MESSAGE: { NAME: 'VerifyMessage', PATH: '/verify' },
  CRYPTO: { NAME: 'Crypto', PATH: '/crypto' },
  LEARN: { NAME: 'Learn', PATH: '/learn' },
  STOCKS: { NAME: 'Stocks', PATH: '/stocks' },
}
const TOKEN_INFO = { PATH: 'token/:tokenId' }
const TOKEN_INFO_ROUTE_NAMES = {
  crypto: 'token-info-crypto',
  home: 'token-info-home',
}
const STOCK_INFO = { PATH: 'stock/:symbol' }
const STOCK_INFO_ROUTE_NAMES = {
  home: 'home-stock-info',
  crypto: 'crypto-stock-info',
  stocks: 'stocks-stock-info',
}

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
  TOKEN_INFO,
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO,
  STOCK_INFO_ROUTE_NAMES,
}
