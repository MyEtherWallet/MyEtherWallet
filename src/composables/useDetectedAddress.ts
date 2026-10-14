import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useChainsStore } from '@/stores/chainsStore'
import type { ChainType } from '@/mew_api/types'

/**
 * Decide which extension address (if any) to surface as "detected". We only
 * prompt for an address that DIFFERS from the connected/active one (that one is
 * already shown in the popup card) and that isn't already saved.
 */
export function nextDetectedAddress(opts: {
  live: string | null
  connected: string | null
  isSaved: (address: string) => boolean
}): string | null {
  const { live, connected, isSaved } = opts
  if (!live) return null
  if (connected && live.toLowerCase() === connected.toLowerCase()) return null
  if (isSaved(live)) return null
  return live
}

export function useDetectedAddress() {
  const walletStore = useWalletStore()
  const watchOnlyStore = useWatchOnlyStore()
  const chainsStore = useChainsStore()

  const isSaved = (address: string): boolean => {
    const type = (chainsStore.selectedChain?.type ?? 'EVM') as ChainType
    return (watchOnlyStore.watchOnlyAddresses[type] ?? []).some(
      e => e.address.toLowerCase() === address.toLowerCase(),
    )
  }

  /**
   * Read the extension's current address and reconcile the detected-address
   * banner. Provider-agnostic: works for any injected wallet exposing
   * getLiveAddress (EVM eth_accounts, BTC getAccounts) and no-ops otherwise.
   */
  const refreshDetectedAddress = async (): Promise<void> => {
    const wallet = walletStore.wallet
    if (!wallet?.getLiveAddress) return
    const live = await wallet.getLiveAddress()
    const detected = nextDetectedAddress({
      live,
      connected: walletStore.walletAddress,
      isSaved,
    })
    if (detected) walletStore.setDetectedAddress(detected)
    else walletStore.clearDetectedAddress()
  }

  return { refreshDetectedAddress }
}
