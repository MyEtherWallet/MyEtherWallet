<script setup lang="ts">
// Icon-only wallet button for the sign-up view's wallet row (Figma Onboarding,
// Variant A). The wallet's name is its accessible label.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import type { WalletConfig } from '@/modules/access/common/walletConfigs'
import { useWalletIconUrl } from '@/modules/access/composables/useWalletIconUrl'

const props = defineProps<{ wallet: WalletConfig }>()
const emit = defineEmits<{ select: [wallet: WalletConfig] }>()
const { t } = useI18n()

const displayName = computed(() =>
  props.wallet.nameKey ? t(props.wallet.nameKey) : props.wallet.name,
)
const iconUrl = useWalletIconUrl(() => props.wallet)
</script>

<template>
  <button
    type="button"
    data-testid="wallet-tile"
    :aria-label="displayName"
    :title="displayName"
    class="flex h-12 grow basis-0 cursor-pointer items-center justify-center rounded-12 bg-background-alternative transition-colors hover:bg-background-alternative-hover"
    @click="emit('select', wallet)"
  >
    <!-- Round brand marks already fill their circle; the wallet avatar would
         inset them as if they were square logos (same as WalletCard). -->
    <img
      v-if="wallet.roundIcon && iconUrl"
      :src="iconUrl"
      alt=""
      class="size-8 shrink-0 rounded-full"
    />
    <AppAvatar
      v-else
      type="wallet"
      size="m"
      :url="iconUrl"
      :name="displayName"
    />
  </button>
</template>
