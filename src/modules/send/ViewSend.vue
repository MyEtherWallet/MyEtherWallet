<template>
  <main>
    <h1>Send</h1>
    <form @submit.prevent="handleSubmit">
      <div class="flex">
        <div>
          <label for="asset-input">Token:</label>
          <select name="asset-input" v-model="tokenSelected">
            <option v-for="(t, idx) in tokenOptions" :value="t" :key="t+idx">{{ t }}</option>
          </select>
        </div>
        <div>
          <label for="amount-input">Amount:</label>
          <input
            v-model="amount"
            name="amount-input"
            type="number"
            step="0.000000000000000001"
            required
          />
        </div>
      </div>
      <br />
      <label for="address-input">Address:</label>
      <input v-model="toAddress" name="address-input" type="string" required />
      <br />
      <div>
        <input
          type="checkbox"
          name="advanced-settings"
          v-model="toggleAdvanced">
        <label for="advanced-settings">Advanced settings</label>
      </div>
      <div v-show="toggleAdvanced">
        <div v-if="toggleTransactionType">
          <label for="address-input">Gas Price:</label>
          <input v-model="gasPrice" name="address-input" type="string" required />
        </div>
        <div v-if="!toggleTransactionType">
          <label for="address-input">Max priority fee per gas:</label>
          <input v-model="maxPriorityFee" name="address-input" type="string" required />
        </div>
        <div v-if="!toggleTransactionType">
          <label for="address-input">Max fee per gas:</label>
          <input v-model="maxFeePerGas" name="address-input" type="string" required />
        </div>
        <div>
          <label for="address-input">Gas Limit:</label>
          <input v-model="gasLimit" name="address-input" type="string" required />
        </div>
        <div>
          <label for="address-input">Nonce:</label>
          <input v-model="nonce" name="address-input" type="string" required />
        </div>
        <div>
          <label for="address-input">Data:</label>
          <input v-model="data" name="address-input" type="string" required />
        </div>
        <input
          type="checkbox"
          name="advanced-settings"
          v-model="toggleTransactionType">
        <label for="advanced-settings">Transaction type: {{ toggleTransactionType ? 0 : 2  }}</label>
      </div>
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
// import { fromWei } from 'web3-utils';

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

const amount = ref('')
const toAddress = ref('')
const tokenSelected = ref('ETH') // TODO: Implement token selection
const tokenOptions = ref(['ETH', 'DAI', 'USDC']) // TODO: update once api is ready
const toggleAdvanced = ref(false)
// advanced settings
const gasLimit = ref(21000) // TODO: Implement gas limit once api is ready
const gasPrice = ref(30000000000) // TODO: Implement gas price once api is ready
const nonce = ref(0) // TODO: Implement nonce once api is ready
const data = ref('')
const toggleTransactionType = ref(true)
const maxPriorityFee = ref(0) // TODO: Implement maxPriorityFee once api is ready
const maxFeePerGas = ref(0) // TODO: Implement maxFeePerGas once api is ready



// const fees = computed(() => {
//   return fromWei((gasLimit.value * gasPrice.value).toString(), 'ether')
// })
// const amountErrorMessages = computed(() => {
//   if(amount.value === '') return 'Amount is required'
//   if(Number(amount.value) <= 0) return 'Amount must be greater than 0'
//   if(tokenSelected.value.balance < Number(amount.value)) return 'Insufficient balance for this token'
//   if(Number(amount.value) + Number(fees.value) > tokenSelected.value.balance) return 'Insufficient balance for fees'

//   return ''
// })

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
