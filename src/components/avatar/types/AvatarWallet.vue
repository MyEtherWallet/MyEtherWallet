<script setup lang="ts">
import { computed } from 'vue'
import AvatarRemoteImage from '../AvatarRemoteImage.vue'
import { AVATAR_FALLBACK_TEXT_CLASS, type AvatarSize } from '../types'

// _Wallets (166:15). The app already resolves wallet icons at runtime — a
// committed .webp for the default wallets and the wagmi/RainbowKit connector's
// iconUrl for the rest (see useWalletList.walletGetIcon). So this type is a thin
// remote-image wrapper: pass the icon `url` you already have, not a committed
// brand mark.
const props = defineProps<{
  size: AvatarSize
  url?: string | null
  /** Optional fallback initials (e.g. the wallet name) when the url is missing. */
  name?: string
  /** `cover` fills the circle edge to edge instead of insetting the mark. */
  fit?: 'contain' | 'cover'
}>()

defineOptions({ inheritAttrs: false })

const fallbackTextClass = computed(() => AVATAR_FALLBACK_TEXT_CLASS[props.size])
</script>

<template>
  <!-- Wallet marks are square; by default inset so the full logo sits inside the
       circle (contained) instead of filling it and getting its corners clipped.
       `cover` trades the corners for a uniform circular mark across wallets. -->
  <div class="w-full h-full box-border" :class="{ 'p-[15%]': fit !== 'cover' }">
    <AvatarRemoteImage
      :url="url"
      :fallback-text="name"
      :fallback-text-class="fallbackTextClass"
      :fit="fit"
    />
  </div>
</template>
