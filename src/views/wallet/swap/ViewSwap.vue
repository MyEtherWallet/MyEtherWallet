<template>
  <div>
    <p class="text-s-80 my-8 text-center" v-if="!isWalletConnected">
      {{ t('swap.title1') }}
    </p>
    <p class="my-4 text-s-20 text-center" v-if="!isWalletConnected">
      {{ t('swap.title2') }}
    </p>
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/stores/walletStore'

const { t } = useI18n()
const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
</script>
