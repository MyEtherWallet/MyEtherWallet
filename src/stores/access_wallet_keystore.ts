import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  EthSaleKeystore,
  V3Keystore,
  MEWKeystore,
} from '@/modules/access/common/types'

export const useAccessWalletKeystore = defineStore(
  'accessWalletKeystore',
  () => {
    const keystore = ref<EthSaleKeystore | V3Keystore | MEWKeystore | null>()

    const uploadKeystore = (evt: Event) => {
      const input = evt.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        const file = input.files[0]
        const reader = new FileReader()
        reader.onload = () => {
          keystore.value = JSON.parse(reader.result as string)
        }
        reader.readAsBinaryString(file)
      }
    }

    const resetKeystore = () => {
      keystore.value = null
    }

    return { uploadKeystore, keystore, resetKeystore }
  },
)
