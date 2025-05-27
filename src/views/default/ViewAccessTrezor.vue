<template>
  <main class="flex justify-center w-full">
    <app-sheet
      :title="$t('access_wallet_recovery_phrase.title')"
      :sheet-class="'max-w-[624px]'"
      :title-class="'text-center'"
    >
      <!-- TODO add proper link arrow icon?-->
      <div class="flex justify-center">
        <router-link
          :to="{ name: ROUTES_ACCESS.HOME.NAME }"
          class="text-center underline text-base mb-8 mx-auto"
          >or select another access method
        </router-link>
      </div>
      <module-access-trezor />
      <app-need-help
        title="How to connect your wallet with Trezor"
        help-link="https://help.myetherwallet.com/en/articles/5433710-using-a-trezor-hardware-wallet-with-mew"
        class="md:mt-[80px] mt-10 mb-4 text-center"
      />
    </app-sheet>
  </main>
</template>
<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import ModuleAccessTrezor from '@/modules/access/ModuleAccessTrezor.vue'
import { ROUTES_ACCESS } from '@/router/routeNames'
</script>
