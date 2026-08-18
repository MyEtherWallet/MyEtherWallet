import { toChecksumAddress as toChecksumAddressWeb3 } from 'web3-utils'
import { isAddress as isAddressLib, isHexStrict } from 'web3-validator'
import {
  toChecksumAddress as toChecksumAddr,
  isValidChecksumAddress,
} from '@ethereumjs/util'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'
import type { ChainType } from '@/mew_api/types'

const isAddress = (
  address: string,
  network: string | undefined = undefined,
): boolean => {
  if (!address) return false
  const store = useGlobalStore()
  const { selectedNetwork } = storeToRefs(store)
  const _network = network || selectedNetwork.value
  // TODO: change to global definition instead of hardcoding
  if (_network === 'ROOTSTOCK') {
    // check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false
      // If it's ALL lowercase or ALL upppercase
    } else if (
      /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
      /^(0x|0X)?[0-9A-F]{40}$/.test(address)
    ) {
      return true
      // Otherwise check each case
    }

    return isValidChecksumAddress(address, 30)
  }
  return (
    address !== '' &&
    isHexStrict(address) &&
    isAddressLib(toChecksumAddr(address))
  )
}

const toChecksumAddress = (
  address: string,
  network: string | undefined = undefined,
): string => {
  const store = useGlobalStore()
  const { selectedNetwork } = storeToRefs(store)
  const _network = network || selectedNetwork.value

  /**
   * ethereumjs/util works differently than web3-utils
   * because of the chainID parameter being added to the checksum function
   *
   */
  // TODO: change to global definition instead of hardcoding
  if (_network === 'ROOTSTOCK') {
    return toChecksumAddr(address, 30)
  }
  return toChecksumAddressWeb3(address)
}

/**
 * Returns true when an address format is incompatible with a chain type —
 * an EVM `0x` address on a BITCOIN chain, or a non-EVM address on an EVM chain.
 * Persisting or building a wallet from such a pair yields invalid MEW API
 * requests the backend 404s on (MEW-2043). Reuses the EVM address validator.
 */
const isAddressChainTypeMismatch = (
  address: string,
  chainType: ChainType,
  chainName?: string,
): boolean => {
  const isEvmAddress = isAddress(address, chainName)
  if (chainType === 'BITCOIN') return isEvmAddress
  if (chainType === 'EVM') return !isEvmAddress
  return false
}

export { isAddress, toChecksumAddress, isAddressChainTypeMismatch }
