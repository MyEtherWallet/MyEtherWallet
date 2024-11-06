import { toChecksumAddress as toChecksumAddressWeb3 } from 'web3-utils';
import { isAddress as isAddressLib, isHexStrict } from 'web3-validator';
import { toChecksumAddress as toChecksumAddr, isValidChecksumAddress } from '@ethereumjs/util';
import { useGlobalStore } from '@/stores/global_store';
import { storeToRefs } from 'pinia';

const isAddress = (address: string): boolean => {
  const store = useGlobalStore();
  const { network } = storeToRefs(store);
  const { chainID } = network.value.type;

  // temp: change to global definition instead of hardcoding
  if (chainID === 30) {
    // check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false;
      // If it's ALL lowercase or ALL upppercase
    } else if (
      /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
      /^(0x|0X)?[0-9A-F]{40}$/.test(address)
    ) {
      return true;
      // Otherwise check each case
    }

    return isValidChecksumAddress(address, chainID);
  }
  return (
    address !== '' && isHexStrict(address) && isAddressLib(toChecksumAddr(address))
  )
}

const toChecksumAddress = (address: string): string => {
  const store = useGlobalStore();
  const { network } = storeToRefs(store);
  const { chainID } = network.value.type;

  /**
   * ethereumjs/util works differently than web3-utils
   * because of the chainID parameter being added to the checksum function
   * 
   */
  // temp: change to global definition instead of hardcoding
  if (chainID === 30) {
    return toChecksumAddr(address, chainID);
  }
  return toChecksumAddressWeb3(address)
}

export {
  isAddress,
  toChecksumAddress,
}