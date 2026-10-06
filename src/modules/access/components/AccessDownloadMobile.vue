<template>
  <div class="flex flex-col gap-4">
    <section class="flex flex-col gap-4 rounded-20 bg-background-default p-5">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm font-medium">
          {{ t('access_wallet.download_mobile.download_for') }}
        </span>
        <AppSegmentedControl
          v-model="platform"
          :items="platformItems"
          size="small"
          :label="t('access_wallet.download_mobile.download_for')"
        />
      </div>
      <AppDivider />
      <div
        class="relative mx-auto w-full max-w-[336px] rounded-16 bg-white p-6"
        role="img"
        :aria-label="
          t('access_wallet.download_mobile.qr_label', {
            platform: PLATFORM_NAME[platform],
          })
        "
      >
        <QrcodeVue
          :value="storeUrl[platform]"
          render-as="svg"
          level="H"
          :size="288"
          class="block h-auto w-full"
        />
        <span
          class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        >
          <AppAvatar type="icon" size="xl" :background="false" badge-top>
            <template #icon>
              <span
                class="flex size-full items-center justify-center rounded-full bg-background-decorative-green text-white"
              >
                <span
                  data-testid="qr-platform-glyph"
                  class="size-1/2 bg-current"
                  :style="glyphMask(PLATFORM_LOGO[platform])"
                />
              </span>
            </template>
            <template #badge>
              <AppAvatarBadge type="network">
                <img :src="MewLogo" alt="" class="size-full" />
              </AppAvatarBadge>
            </template>
          </AppAvatar>
        </span>
      </div>
    </section>
    <div class="grid grid-cols-2 gap-3">
      <AppBaseButton
        v-for="store in STORE_ORDER"
        :key="store"
        :data-testid="`store-${store}`"
        theme="secondary"
        class="!px-4"
        @click="openStore(store)"
      >
        <span class="flex items-center justify-center gap-2 whitespace-nowrap">
          <span
            class="size-4 bg-current"
            :style="glyphMask(PLATFORM_LOGO[store])"
          />
          {{ t(`access_wallet.download_mobile.get_${store}`) }}
        </span>
      </AppBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import QrcodeVue from 'qrcode.vue'
import AppSegmentedControl from '@/components/segmented_control/AppSegmentedControl.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppAvatarBadge from '@/components/avatar/AppAvatarBadge.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppleLogo from '@/assets/images/access/apple.svg'
import AndroidLogo from '@/assets/images/access/android.svg'
import MewLogo from '@/assets/images/access/mew-app.webp'
import { walletConfigs } from '@/modules/access/common/walletConfigs'

type Platform = 'ios' | 'android'

/** Button order follows Figma: Android left, iOS right. */
const STORE_ORDER: Platform[] = ['android', 'ios']
const PLATFORM_NAME: Record<Platform, string> = {
  ios: 'iOS',
  android: 'Android',
}
const PLATFORM_LOGO: Record<Platform, string> = {
  ios: AppleLogo,
  android: AndroidLogo,
}
const platformItems = (['ios', 'android'] as const).map(value => ({
  value,
  label: PLATFORM_NAME[value],
}))
const storeUrl: Record<Platform, string> = {
  ios: walletConfigs.mew.downloadUrls?.ios ?? '',
  android: walletConfigs.mew.downloadUrls?.android ?? '',
}

const { t } = useI18n()
const platform = ref<Platform>('ios')

/** Paints a brand logo in the current text colour (white in the QR, brand on the buttons). */
const glyphMask = (url: string) => {
  const mask = `url("${url}") center / contain no-repeat`
  return { mask, WebkitMask: mask }
}

const openStore = (store: Platform) =>
  window.open(storeUrl[store], '_blank', 'noopener,noreferrer')
</script>
