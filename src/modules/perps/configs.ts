import { PerpsClient } from './sdk'
import { mainnet } from 'viem/chains'

const IS_PERPS_LIVE = false

const PERPS_BASE_URL = {
  sandbox: { url: `https://api.ondoperps-sandbox.xyz` },
  live: { url: `https://api.ondoperps.xyz` },
}

const perpsClient = new PerpsClient(
  IS_PERPS_LIVE ? PERPS_BASE_URL.live.url : PERPS_BASE_URL.sandbox.url,
)

const SUPPORTED_NETWORK = [mainnet]
const USDC_ADDRESS = {
  [mainnet.id]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}

const MAINNET_ENABLED = false

export {
  IS_PERPS_LIVE,
  PERPS_BASE_URL,
  perpsClient,
  SUPPORTED_NETWORK,
  USDC_ADDRESS,
  MAINNET_ENABLED,
}
