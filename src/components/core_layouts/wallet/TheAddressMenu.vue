<template>
  <div>
    <button
      class="hoverNoBG py-2 px-3 rounded-16 w-full shadow-button shadow-button-elevated"
      @click="setOpenDialog(true)"
    >
      <div v-if="getAddress" class="flex items-center">
        <app-blockie
          :address="getAddress"
          :size="6"
          is-flat
          class="mr-1 rounded-full"
        />
        <div class="mr-2 ml-1 font-medium text-sm">
          {{ truncateAddress(getAddress, 7) }}
        </div>
        <chevron-down-icon class="w-4 h-4 ml-auto mr-1" />
      </div>
    </button>

    <!-- Dialog with chains list -->
    <app-dialog
      v-if="getAddress !== null"
      v-model:is-open="openDialog"
      title="Address Menu"
      class="xs:max-w-[428px] sm:mx-auto"
    >
      <template #content>
        <div class="p-5">
          <p class="text-center">Temp Menu</p>
        </div>
      </template>
    </app-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppBlockie from '@/components/AppBlockie.vue'
import { useWalletStore } from '@/stores/walletStore'
import { truncateAddress } from '@/utils/filters'

const store = useWalletStore()
const { getAddress } = storeToRefs(store)

defineProps({
  isBtnGroup: {
    type: Boolean,
    default: false,
  },
  hasLabel: {
    type: Boolean,
    default: true,
  },
})

/** -------------------------------
 * Dialog
 -------------------------------*/
const openDialog = ref(false)
const setOpenDialog = (value: boolean) => {
  openDialog.value = value
}
</script>
