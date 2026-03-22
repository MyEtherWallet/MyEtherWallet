import { PerpsClient } from './sdk'
import { mainnet } from 'viem/chains'

const PERPS_BASE_URL = `https://api.ondoperps-sandbox.xyz`

const perpsClient = new PerpsClient(PERPS_BASE_URL)

const SUPPORTED_NETWORK = [mainnet]
const USDC_ADDRESS = {
  [mainnet.id]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}

const MAINNET_ENABLED = false

export {
  PERPS_BASE_URL,
  perpsClient,
  SUPPORTED_NETWORK,
  USDC_ADDRESS,
  MAINNET_ENABLED,
}
