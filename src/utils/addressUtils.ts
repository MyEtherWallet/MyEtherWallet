import { toChecksumAddress as toChecksumAddressWeb3 } from 'web3-utils'
import { isAddress as isAddressLib, isHexStrict } from 'web3-validator'
import {
  toChecksumAddress as toChecksumAddr,
  isValidChecksumAddress,
} from '@ethereumjs/util'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'

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

export { isAddress, toChecksumAddress }
