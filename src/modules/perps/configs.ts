import configs from '@/configs'
import { PerpsClient } from './sdk'
import { mainnet } from 'viem/chains'

const IS_PERPS_LIVE = true

const PERPS_BASE_URL = {
  sandbox: { url: `https://api.ondoperps-sandbox.xyz` },
  live: { url: `https://api.ondoperps-sandbox.xyz` },
}

const PERPS_WS_URL = {
  sandbox: `wss://api.ondoperps-sandbox.xyz/ws`,
  live: `wss://api.ondoperps-sandbox.xyz/ws`,
}

const perpsClient = new PerpsClient(
  !configs.IS_DEV_MODE ? PERPS_BASE_URL.live.url : PERPS_BASE_URL.sandbox.url,
)

const perpsWsUrl = !configs.IS_DEV_MODE ? PERPS_WS_URL.live : PERPS_WS_URL.sandbox

const SUPPORTED_NETWORK = [mainnet]
// Perps operates on Ethereum mainnet only; the API takes chainId as a string.
// Derived from viem's `mainnet` (same source as USDC_ADDRESS) so the chain
// identity lives in one place instead of a literal '1' at call sites.
const PERPS_CHAIN_ID = String(mainnet.id)
const USDC_ADDRESS = {
  [mainnet.id]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}

const USDC_DECIMALS = {
  [mainnet.id]: 6,
}

const BUILDER_CODE = 'myetherwallet'
const MAINNET_ENABLED = false

const PERPS_PAGE_SIZE = 10
const PERPS_INFO_PAGE_SIZE = 5

export {
  IS_PERPS_LIVE,
  PERPS_BASE_URL,
  PERPS_WS_URL,
  perpsClient,
  perpsWsUrl,
  SUPPORTED_NETWORK,
  PERPS_CHAIN_ID,
  USDC_ADDRESS,
  USDC_DECIMALS,
  MAINNET_ENABLED,
  BUILDER_CODE,
  PERPS_PAGE_SIZE,
  PERPS_INFO_PAGE_SIZE,
}
