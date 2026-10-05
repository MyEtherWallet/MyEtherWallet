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
        <AppAvatar
          type="icon"
          size="m"
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <template #icon>
            <img :src="PLATFORM_LOGO[platform]" alt="" class="size-5" />
          </template>
        </AppAvatar>
      </div>
    </section>
    <div class="grid grid-cols-2 gap-3">
      <AppBaseButton
        v-for="store in STORE_ORDER"
        :key="store"
        :data-testid="`store-${store}`"
        :theme="store === platform ? 'secondary' : 'neutral'"
        @click="openStore(store)"
      >
        <span class="flex items-center justify-center gap-2">
          <img :src="PLATFORM_LOGO[store]" alt="" class="size-5" />
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
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppleLogo from '@/assets/images/access/apple.svg'
import AndroidLogo from '@/assets/images/access/android.svg'
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

const openStore = (store: Platform) =>
  window.open(storeUrl[store], '_blank', 'noopener,noreferrer')
</script>
