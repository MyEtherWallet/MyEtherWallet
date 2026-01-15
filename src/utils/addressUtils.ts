import { useGlobalStore } from '@/stores/globalStore'
import { isAddress as isAddressLib, checksumAddress, type Address } from 'viem'

/**
 * Validates if the given string is a valid Ethereum address.
 * Includes special handling for Rootstock (RSK) checksummed addresses (EIP-1191).
 */
const isAddress = (address: string): boolean => {
  if (!address) return false

  const { selectedNetwork } = useGlobalStore()

  if (selectedNetwork === 'ROOTSTOCK') {
    // Basic hex requirement for 20-byte address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false

    // If it's ALL lowercase or ALL uppercase, it's valid as a non-checksummed address
    const stripped = address.replace(/^0x/i, '')
    if (
      stripped === stripped.toLowerCase() ||
      stripped === stripped.toUpperCase()
    ) {
      return true
    }

    // Perform RSK specific checksum verification (ChainID 30)
    try {
      return (
        checksumAddress(`0x${stripped.toLowerCase()}` as Address, 30) ===
        address
      )
    } catch {
      return false
    }
  }

  return isAddressLib(address)
}

/**
 * Returns the checksummed version of the given address.
 * Automatically detects if Rootstock checksumming (ChainID 30) should be applied.
 */
const toChecksumAddress = (address: string): string => {
  if (!address) return ''
  const { selectedNetwork } = useGlobalStore()
  const chainId = selectedNetwork === 'ROOTSTOCK' ? 30 : undefined

  try {
    return checksumAddress(address as Address, chainId)
  } catch {
    return address
  }
}

export { isAddress, toChecksumAddress }
