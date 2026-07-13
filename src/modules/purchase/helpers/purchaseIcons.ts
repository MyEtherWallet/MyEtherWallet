import { PURCHASE_CHAIN_TO_V7, type PurchaseAsset } from '@/types/buyToken'
import type { useChainsStore } from '@/stores/chainsStore'

const NATIVE_TOKEN_CONTRACT = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

type ChainsStore = ReturnType<typeof useChainsStore>

export const getPurchaseChainIcon = (
  purchaseChain: string,
  assets: PurchaseAsset[],
  chainsStore: ChainsStore,
): string | undefined => {
  const v7ChainName = PURCHASE_CHAIN_TO_V7[purchaseChain]
  if (v7ChainName) {
    const icon = chainsStore.getChainIcon(v7ChainName)
    if (icon) return icon
  }
  const nativeAsset =
    assets.find(a => a.contract_address === NATIVE_TOKEN_CONTRACT) ?? assets[0]
  return nativeAsset?.market_data?.icon
}

export const getPurchaseTokenIcon = (
  asset: PurchaseAsset,
  purchaseChainAssets: PurchaseAsset[],
  chainsStore: ChainsStore,
  coinImages?: Map<string, string>,
): string | undefined => {
  const isNative =
    asset.contract_address === NATIVE_TOKEN_CONTRACT ||
    asset.symbol === asset.chain
  if (isNative) {
    return getPurchaseChainIcon(asset.chain, purchaseChainAssets, chainsStore)
  }
  return coinImages?.get(asset.coingecko_id) ?? asset.market_data?.icon
}

const fiatIconModules = import.meta.glob<string>(
  '@/assets/images/fiat/*.svg',
  { eager: true, query: '?url', import: 'default' },
)

const fiatIconMap: Record<string, string> = Object.fromEntries(
  Object.entries(fiatIconModules).map(([path, url]) => {
    const filename = path.split('/').pop() ?? ''
    const code = filename.replace(/\.svg$/, '').toUpperCase()
    return [code, url]
  }),
)

export const getFiatIcon = (fiatCurrency: string): string | undefined => {
  return fiatIconMap[fiatCurrency.toUpperCase()]
}
