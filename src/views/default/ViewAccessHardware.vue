<template>
  <main class="flex justify-center w-full">
    <app-sheet
      :title="$t(`${hardwareDetails.title}`)"
      :sheet-class="'max-w-[624px]'"
      :title-class="'text-center'"
    >
      <!-- TODO add proper link arrow icon?-->
      <div class="flex justify-center">
        <router-link
          :to="{ name: ROUTES_MAIN.HOME.NAME }"
          class="text-center underline text-base mb-8 mx-auto"
          >or select another access method
        </router-link>
      </div>
      <module-access-hardware-wallet />
      <app-need-help
        :title="hardwareDetails.articleTitle"
        :help-link="hardwareDetails.articleLink"
        class="md:mt-[80px] mt-10 mb-4 text-center"
      />
    </app-sheet>
  </main>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import AppSheet from '@/components/AppSheet.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import ModuleAccessHardwareWallet from '@/modules/access/ModuleAccessHardwareWallet.vue'
import { ROUTES_MAIN, ROUTES_ACCESS } from '@/router/routeNames'
import { useRoute } from 'vue-router'

const route = useRoute()

const hardwareDetails = computed(() => {
  switch (route.name) {
    case ROUTES_ACCESS.ACCESS_TREZOR.NAME:
      return {
        title: 'access_wallet_trezor.title',
        articleTitle: 'How to connect your wallet with Trezor',
        articleLink:
          'https://help.myetherwallet.com/en/articles/5433710-using-a-trezor-hardware-wallet-with-mew',
      }
    case ROUTES_ACCESS.ACCESS_LEDGER.NAME:
      return {
        title: 'access_wallet_ledger.title',
        articleTitle: 'How to connect your wallet with Ledger',
        articleLink:
          'https://help.myetherwallet.com/en/articles/5433709-using-a-ledger-hardware-wallet-with-mew',
      }
    default:
      return {
        title: '',
        articleTitle: '',
        articleLink: '',
      }
  }
})
</script>
