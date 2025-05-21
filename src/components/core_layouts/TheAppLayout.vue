<template>
    <div ref="appBodyRef" class="min-h-screen w-full static">
      <the-wallet-header />

    <div
      :class="[
        'flex flex-col justify-center overflow-y-auto relative px-5 xs:px-10',
      ]"
    >
      <main
        :class="['flex-initial w-full max-w-[496px] xs:max-w-[932px] mx-auto']"
      >
        <div class="mt-[84px] xs:mt-[104px] min-h-[500px]">
          <router-view />
        </div>
      </main>
    </div>
    <MewFooter
      :use-i18n="useI18n"
      :amplitude="analytics.amplitude"
      :link-component="RouterLink"
      :package-version="packageVersion"
      :user-consent="popupStore.consent"
      :curr-project="CURR_PROJECT"
      @update:consent="handleSetConsent"
    >
  </div>
</template>

<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { type TokenBalancesRaw } from '@/mew_api/types'
import {  MewFooter } from '@myetherwallet/vue-common-components'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { inject } from 'vue'
import type { Analytics } from '@/analytics/amplitude'
import { Provider } from '@/providers'
import { usePopupStore } from '@/stores/popup'
import TheWalletHeader from './wallet/TheWalletHeader.vue'


const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { setTokens, setIsLoadingBalances } = store

wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
  setTokens(balances.result)
  setIsLoadingBalances(false)
})

const popupStore = usePopupStore()
const analytics = inject<Analytics>(Provider.ANALYTICS)!

//TODO: make a new project for MEW  PORTOFLIO APP
const CURR_PROJECT = 'MEW_BLOG'
/**
 * App Version
 */

const packageVersion = 'v7'

const handleSetConsent = (consent: boolean) => {
  popupStore.setTrackingConsent(consent)
}
</script>

<style scoped></style>
