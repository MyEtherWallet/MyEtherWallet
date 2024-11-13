<template>
  <main>
    <button @click="clickUpload">Upload Keystore</button>
    <input
      ref="jsonInput"
      type="file"
      name="file"
      style="display: none"
      @change="uploadKeystoreFile"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessWalletKeystore } from '@/stores/access_wallet_keystore'

const jsonInput = ref(null)
const router = useRouter()

const store = useAccessWalletKeystore()
const { uploadKeystore } = store

const clickUpload = () => {
  jsonInput.value.value = ''
  jsonInput.value.click()
}

const uploadKeystoreFile = (e: Event) => {
  uploadKeystore(e)
  jsonInput.value.value = '' // clear file input
  router.push('/access/keystore/password')
}
</script>
