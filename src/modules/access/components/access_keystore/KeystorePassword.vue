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
import { ROUTES_WALLET } from '@/router/routeNames'
import PrivateKeyWallet from '@/providers/ethereum/privateKeyWallet'

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
    const wallet = new PrivateKeyWallet(Buffer.from(res.getPrivateKey()), '0x1')
    resetKeystore()
    setWallet(wallet)
    router.push({ path: ROUTES_WALLET.WALLET.PATH })
  }
}
</script>
