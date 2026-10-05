<template>
  <div class="flex flex-col gap-6">
    <section class="rounded-20 bg-background-default p-5">
      <div
        class="flex flex-col items-center gap-6 rounded-16 bg-white px-6 py-6"
      >
        <p v-if="clickedWalletConnect" class="text-center text-base">
          {{
            $t('wc_dialog.scan_qr_code', {
              walletName: clickedWalletConnect.walletName,
            })
          }}
        </p>
        <div class="relative aspect-square w-full max-w-[240px]">
          <template v-if="uri">
            <QrcodeVue
              :value="uri"
              render-as="svg"
              level="H"
              :size="240"
              class="block h-auto w-full"
            />
            <span
              class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2"
            >
              <AppAvatar
                v-if="clickedWalletConnect?.walletIcon"
                type="wallet"
                size="xl"
                :url="clickedWalletConnect.walletIcon"
                :name="clickedWalletConnect.walletName"
                class="rounded-full ring-4 ring-white"
              />
            </span>
          </template>
          <div
            v-else
            data-testid="wc-qr-loading"
            class="flex size-full items-center justify-center rounded-16 bg-background-default"
          >
            <AppSpinner size-class="size-6" class="text-text-brand" />
          </div>
        </div>
        <div class="flex items-center gap-1 text-base font-semibold">
          <span>{{ $t('wc_dialog.or_copy_link') }}</span>
          <AppBtnCopy v-if="uri" :copy-value="uri" />
        </div>
        <a
          class="text-xs text-text-subtle"
          href="https://walletconnect.network/"
          target="_blank"
          rel="noreferrer"
        >
          {{ $t('common.powered_by') }} WalletConnect
        </a>
      </div>
    </section>
    <p class="text-center text-sm text-text-subtle">
      {{ $t('wc_dialog.need_help_short') }}
      <a
        data-testid="wc-help-center"
        class="ml-1 font-semibold text-text-brand"
        :href="HELP_URL"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('wc_dialog.go_to_help_center') }}
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import QrcodeVue from 'qrcode.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppBtnCopy from '@/components/AppBtnCopy.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import { useAccessStore } from '@/stores/accessStore'

const HELP_URL =
  'https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio'

const { clickedWalletConnect } = storeToRefs(useAccessStore())

/** WalletConnect pairing URI; empty until the connector emits it. */
const uri = computed(() => clickedWalletConnect.value?.wagmiWalletData || '')
</script>
