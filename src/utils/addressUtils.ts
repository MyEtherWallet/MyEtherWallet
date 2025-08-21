import { toChecksumAddress as toChecksumAddressWeb3 } from 'web3-utils'
import { isAddress as isAddressLib, isHexStrict } from 'web3-validator'
import {
  toChecksumAddress as toChecksumAddr,
  isValidChecksumAddress,
} from '@ethereumjs/util'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'

const isAddress = (address: string): boolean => {
  if (!address) return false
  const store = useGlobalStore()
  const { selectedNetwork } = storeToRefs(store)

  // TODO: change to global definition instead of hardcoding
  if (selectedNetwork.value === 'ROOTSTOCK') {
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

const toChecksumAddress = (address: string): string => {
  const store = useGlobalStore()
  const { selectedNetwork } = storeToRefs(store)

  /**
   * ethereumjs/util works differently than web3-utils
   * because of the chainID parameter being added to the checksum function
   *
   */
  // TODO: change to global definition instead of hardcoding
  if (selectedNetwork.value === 'ROOTSTOCK') {
    return toChecksumAddr(address, 30)
  }
  return toChecksumAddressWeb3(address)
}

export { isAddress, toChecksumAddress }
