import configs from '@/configs'
import { PerpsClient } from './sdk'
import { mainnet } from 'viem/chains'

const IS_PERPS_LIVE = true

const PERPS_BASE_URL = {
  sandbox: { url: `https://api.ondoperps-sandbox.xyz` },
  live: { url: `https://api.ondoperps.xyz` },
}

const perpsClient = new PerpsClient(
  !configs.IS_DEV_MODE ? PERPS_BASE_URL.live.url : PERPS_BASE_URL.sandbox.url,
)

const SUPPORTED_NETWORK = [mainnet]
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
  perpsClient,
  SUPPORTED_NETWORK,
  USDC_ADDRESS,
  USDC_DECIMALS,
  MAINNET_ENABLED,
  BUILDER_CODE,
  PERPS_PAGE_SIZE,
  PERPS_INFO_PAGE_SIZE,
}
