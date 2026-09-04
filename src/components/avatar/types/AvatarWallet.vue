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
}>()

defineOptions({ inheritAttrs: false })

const fallbackTextClass = computed(() => AVATAR_FALLBACK_TEXT_CLASS[props.size])
</script>

<template>
  <AvatarRemoteImage
    :url="url"
    :fallback-text="name"
    :fallback-text-class="fallbackTextClass"
  />
</template>
