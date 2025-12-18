<template>
  <app-dialog
    v-model:is-open="isOpenCustomTokenDialog"
    :title="title"
    :persistent="false"
    z-index-overlay="z-[150]"
    z-index-container="z-[151]"
    bg="bg-white"
  >
    <template #content>
      <div class="p-4">
        <div v-if="currentView === 'add'">
          <address-input
            v-model:adr-input="adrInput"
            label="Token Address"
            :resolved-address="resolvedAddress"
            :address-error-messages="adrError"
            :chain="selectedChain"
            @validate:address="validateAddressInput"
            @immediate-update:resolved-address="onInput"
          />
          <app-input
            placeholder="Token Name"
            v-model="tokenName"
            :is-disabled="fetchingDetails"
          />
          <app-input
            placeholder="Token Decimals"
            v-model="tokenDecimals"
            :is-disabled="fetchingDetails"
          />
        </div>
        <div v-if="currentView === 'edit'"></div>
        <div v-if="currentView === 'delete'"></div>
        <app-base-button class="mt-4 w-full">Submit</app-base-button>
      </div>
    </template>
  </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@/components/AppDialog.vue'
import AppInput from '@/components/AppInput.vue'
import AddressInput from '@/components/address_book/AddressInput.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useCustomTokenStore } from '@/stores/customTokenStore'
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useChainsStore } from '@/stores/chainsStore'
import { useAddressInput } from '@/composables/useAddressInput'
import { createPublicClient, webSocket } from 'viem'
import { create } from 'domain'

const chainStore = useChainsStore()
const { selectedChain } = storeToRefs(chainStore)
const tokenName = ref('')
const tokenDecimals = ref('')
const customTokenStore = useCustomTokenStore()
const fetchingDetails = ref(false)
const { isOpenCustomTokenDialog, currentView } = storeToRefs(customTokenStore)

const title = computed(() => {
  return currentView.value === 'add'
    ? 'Add Custom Token'
    : currentView.value === 'edit'
      ? 'Edit Custom Tokens'
      : 'Delete Custom Token'
})

const { adrInput, adrError, resolvedAddress, onInput, validateAddressInput } =
  useAddressInput(selectedChain)

watch([adrInput], async () => {
  const client = createPublicClient({
    transport: webSocket(
      selectedChain.value?.rpcUrls.length > 0
        ? (selectedChain.value?.rpcUrls?.[0] ?? '')
        : '',
    ),
  })

  console.log(client)

  const metadata = await client.token.getMetadata({
    token: adrInput.value as `0x${string}`,
  })
})
</script>
