import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAccessWalletKeystore = defineStore('accessWalletKeystore', () => {
  const keystore = ref({});

  const uploadKeystore = (evt: Event) => {
    const input = evt.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        keystore.value = JSON.parse(reader.result as string);
      };
      reader.readAsBinaryString(file);
    }
  }

  const resetKeystore = () => {
    keystore.value = {};
  }

  return { uploadKeystore, keystore, resetKeystore }
})
