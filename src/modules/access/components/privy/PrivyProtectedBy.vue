<template>
  <p class="flex items-center justify-center gap-1 text-xs text-text-subtle">
    {{ t('access_wallet.sign_up.protected_by') }}
    <img :src="PrivyLogo" alt="Privy" class="h-3" />
  </p>
</template>

<script setup lang="ts">
// "Protected by privy" footer shared by every screen of the login flow.
import { useI18n } from 'vue-i18n'
import PrivyLogo from '@/assets/images/access/privy.svg'

const { t } = useI18n()
</script>
