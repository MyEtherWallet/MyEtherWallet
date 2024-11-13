<template>
  <main>
    <label>Enter Password</label>
    <br />
    <input type="password" v-model="password" style="border: 1px solid black" />
    <br />
    <button @click="enterPassword">Submit</button>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAccessWalletKeystore } from '@/stores/access_wallet_keystore'
import { useWalletStore } from '@/stores/wallet_store'

import { unlockKeystore, type V3Keystore } from '../common/helpers'
import WalletInterface from '../common/WalletInterface'

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
      { file: keystore.value, name: res.getV3Filename() },
    )
    resetKeystore()
    setWallet(wallet)

    router.push('/access/wallet')
  }
}
</script>
