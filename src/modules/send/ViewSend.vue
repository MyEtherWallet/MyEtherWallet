<template>
  <main>
    <h1>Send</h1>
    <form @submit.prevent="handleSubmit">
      <label for="amount-input">Amount:</label>
      <input
        v-model="amount"
        name="amount-input"
        type="number"
        step="0.000000000000000001"
        required
      />
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
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

const amount = ref('')
const toAddress = ref('')

const handleSubmit = () => {
  // TODO: Implement send logic once api is provided
  console.log('Send', amount.value, toAddress.value, wallet.value.getAddress())
}
</script>
