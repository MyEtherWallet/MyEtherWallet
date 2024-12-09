<template>
  <div>
    <button
      @click="clickUpload"
      class="mt-10 bg-primary p-2 rounded-full text-white"
    >
      Upload Keystore
    </button>
    <input
      ref="jsonInput"
      type="file"
      name="file"
      style="display: none"
      @change="uploadKeystoreFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessWalletKeystore } from '@/stores/accessWalletKeystore'
import { ROUTES_HOME } from '@/router/routeNames'
const jsonInput = ref<HTMLInputElement | null>(null)
const router = useRouter()

const store = useAccessWalletKeystore()
const { uploadKeystore } = store

const clickUpload = () => {
  if (!jsonInput.value) return
  jsonInput.value.value = ''
  jsonInput.value.click()
}

const uploadKeystoreFile = (e: Event) => {
  try {
    uploadKeystore(e)
    if (jsonInput.value) {
      jsonInput.value.value = '' // clear file input
    }
    router.push({ name: ROUTES_HOME.ACCESS_KEYSTORE_PASSWORD.NAME })
  } catch (error) {
    console.error('Keystore upload failed:', error)
  }
}
</script>
