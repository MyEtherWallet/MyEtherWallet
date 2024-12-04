<template>
  <main>
    <h1>Send</h1>
    <form @submit.prevent="handleSubmit">
      <label for="amount-input">Amount:</label>
      <input v-model="amount" name="amount-input" type="decimal" />
      <br />
      <label for="address-input">Address:</label>
      <input v-model="toAddress" name="address-input" type="string" />
      <br />
      <button type="submit" class="mt-5 bg-primary p-2 rounded-full text-white">
        Send
      </button>
    </form>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/wallet_store'

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

const amount = ref('')
const toAddress = ref('')

const handleSubmit = () => {
  console.log(
    'Send',
    amount.value,
    toAddress.value,
    /**  @ts-expect-error not sure how to handle yet  */
    wallet.value.getAddressString(),
  )
}
</script>
