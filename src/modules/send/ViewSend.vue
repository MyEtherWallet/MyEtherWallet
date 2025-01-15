<template>
  <main>
    <h1>Send</h1>
    <form @submit.prevent="handleSubmit">
      <app-enter-amount v-model="amount" />
      <br />
      <label for="address-input">Address:</label>
      <input v-model="toAddress" name="address-input" type="string" required />
      <br />
      <button type="submit" class="mt-5 bg-primary p-2 rounded-full text-white">
        Send
      </button>
    </form>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/wallet_store'
import AppEnterAmount from '@/components/AppEnterAmount.vue'

const walletStore = useWalletStore()
const { setTokens } = walletStore
const { wallet } = storeToRefs(walletStore)

const amount = ref('')
const toAddress = ref('')

onMounted(async () => {
  const fetchTokens = await fetch(
    `https://tmp.ethvm.dev/balances/137/${wallet.value.getAddressString()}`,
  )
  const tokens = await fetchTokens.json()
  setTokens(tokens.result)
})

const handleSubmit = () => {
  // TODO: Implement send logic once api is provided
  console.log(
    'Send',
    amount.value,
    toAddress.value,
    /**  @ts-expect-error not sure how to handle yet  */
    wallet.value.getAddressString(),
  )
}
</script>
