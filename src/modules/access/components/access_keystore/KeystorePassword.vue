<template>
  <main>
    <label for="enter-password">Enter Password</label>
    <br />
    <input
      type="password"
      v-model="password"
      style="border: 1px solid black"
      name="enter-password"
      aria-label="enter-password"
    />
    <br />
    <button
      @click="enterPassword"
      class="mt-2 bg-primary p-2 rounded-full text-white"
    >
      Submit
    </button>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAccessWalletKeystore } from '@/stores/accessWalletKeystore'
import { useWalletStore } from '@/stores/walletStore'
import {
  unlockKeystore,
  type V3Keystore,
} from '@/modules/access/common/helpers'
import WalletInterface from '@/modules/access/common/walletInterface'
import { ROUTES_WALLET } from '@/router/routeNames'

const accessWalletStore = useAccessWalletKeystore()
const walletStore = useWalletStore()
const router = useRouter()
const { resetKeystore } = accessWalletStore
const { setWallet } = walletStore
const { keystore } = storeToRefs(accessWalletStore)

const password = ref('')

const enterPassword = async () => {
  const res = await unlockKeystore(
    keystore.value as unknown as V3Keystore,
    password.value,
  )
  if (res) {
    // temp: move hardcodes
    const wallet = new WalletInterface(
      Buffer.from(res.getPrivateKey()),
      false,
      'keystore',
      { file: keystore.value!, name: res.getV3Filename() },
    )
    resetKeystore()
    setWallet(wallet)
    router.push({ path: ROUTES_WALLET.WALLET.PATH })
  }
}
</script>
