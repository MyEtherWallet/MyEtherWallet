<template>
  <div class="!p-0 flex items-end justify-center relative overflow-hidden">
    <img
      :src="ImgEthLeft"
      class="contain max-w-[20%] place-self-start"
      width=""
    />

    <div
      class="flex flex-col items-stretch justify-center gap-4 lg:gap-6 text-center py-10 px-3 lg:px-5"
    >
      <div>
        <p class="text-s-24 lg:text-s-40 font-bold mb-2">
          {{ t('portfolio.connect_wallet.title') }}
        </p>

        <p class="text-s-14 lg:text-s-16 text-fg-subtle">
          {{ t('portfolio.connect_wallet.description') }}
        </p>
      </div>
      <div
        class="flex flex-col items-center justify-center gap-3 lg:gap-4 mt-3"
      >
        <app-base-button
          class="min-w-[190px]"
          :size="isDesktopAndUp ? 'large' : 'medium'"
          @click="connectWallet"
        >
          {{ t('portfolio.connect_wallet.connect_button') }}
        </app-base-button>
        <p>
          {{ t('portfolio.connect_wallet.or') }}
          <app-btn-text @click="createWallet" class="underline"
            >{{ t('common.create_new_wallet') }}</app-btn-text
          >
        </p>
      </div>
    </div>
    <img :src="ImgEthRight" class="contain max-w-[20%]" />
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import ImgEthLeft from '@/assets/images/backgrounds/eth-left.webp'
import ImgEthRight from '@/assets/images/backgrounds/eth-right.webp'
import { useRouter } from 'vue-router'
import { ROUTES_ACCESS, ROUTES_CREATE_WALLET } from '@/router/routeNames'

const { t } = useI18n()
const { isDesktopAndUp } = useAppBreakpoints()

const router = useRouter()
/** ------------------------------
 * Connect Wallet
 ------------------------------*/
const connectWallet = () => {
  router.push({ name: ROUTES_ACCESS.ACCESS.NAME })
}

const createWallet = () => {
  router.push({ name: ROUTES_CREATE_WALLET.CREATE_WALLET.NAME })
}
</script>
