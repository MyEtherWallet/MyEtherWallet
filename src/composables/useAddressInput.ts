import { ref, computed, type Ref, unref, watch } from 'vue'
import { type Chain } from '@/mew_api/types'
import { toChecksumAddress, isAddress } from '@/utils/addressUtils'
import { useDebounceFn } from '@vueuse/core'
import ENSNameResolver from '@/providers/common/nameResolver'
import { toOutputScript } from 'bitcoinjs-lib/src/address'
import { INFO_MAP } from '@/providers/common/btcInfo'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'

export const useAddressInput = (
  network: Ref<Chain | undefined> | Chain | undefined,
) => {
  const adrInput = ref<string>('')
  const adrError = ref<string | undefined>(undefined)
  const resolvedAddress = ref<string | undefined>(undefined)
  const chainStore = useChainsStore()
  const { isBitcoinChain, isEvmChain } = storeToRefs(chainStore)

  const isValidAdrInput = computed<boolean>(() => {
    if (isBitcoinChain.value) return true
    return (
      resolvedAddress.value !== undefined &&
      resolvedAddress.value !== '' &&
      isAddress(resolvedAddress.value)
    )
  })

  const resolver = computed(() => {
    const chain = unref(network)
    return new ENSNameResolver(chain?.chainID || '1')
  })

  /**
   * Validates the address input.
   * Checks if the address is empty, valid, and has a valid checksum.
   * Sets error messages accordingly.
   * @returns {boolean} - Returns true if the address is valid, false otherwise.
   */
  const validateAddressInput = () => {
    try {
      const currentSelectedNetwork = unref(network)
      adrError.value = ''
      const addressToCheck = resolvedAddress.value || adrInput.value
      if (addressToCheck === '') {
        adrError.value = 'address is required'
        return false
      }
      if (isEvmChain.value) {
        if (
          !isAddress(addressToCheck) &&
          !(
            resolver.value.isValidName(addressToCheck) &&
            resolvedAddress.value !== ''
          )
        ) {
          adrError.value = 'invalid address'
          return false
        }
      } else if (isBitcoinChain.value) {
        if (!currentSelectedNetwork) {
          adrError.value = 'network is required'
          return false
        }
        const bitcoinNetworkInfo = INFO_MAP[currentSelectedNetwork.name]?.network
        toOutputScript(addressToCheck, bitcoinNetworkInfo) // throws invalid
        return true
      }
      return true
    } catch {
      adrError.value = 'invalid address'
      return false
    }
  }

  const onInput = async () => {
    adrError.value = ''
    resolvedAddress.value = undefined
    try {
      const locResolvedAddr = await resolver.value.resolveName(adrInput.value)
      if (locResolvedAddr && locResolvedAddr !== '') {
        resolvedAddress.value = locResolvedAddr
      } else {
        throw new Error('Address resolution failed')
      }
    } catch {
      if (!validateAddressInput()) {
        resolvedAddress.value = ''
      } else {
        const locResolvedAddr = isBitcoinChain.value ? adrInput.value : toChecksumAddress(adrInput.value)
        resolvedAddress.value = locResolvedAddr
      }
    }

    validateAddressInput()
  }

  const debouncedOnInputAddress = useDebounceFn(onInput, 350, { maxWait: 2000 })

  watch(
    () => adrInput.value,
    () => {
      adrError.value = ''
      resolvedAddress.value = undefined
      debouncedOnInputAddress()
    },
  )

  const clearAddressInput = () => {
    adrInput.value = ''
    adrError.value = undefined
    resolvedAddress.value = undefined
  }

  return {
    adrInput,
    adrError,
    resolvedAddress,
    isValidAdrInput,
    onInput,
    validateAddressInput,
    clearAddressInput
  }
}
