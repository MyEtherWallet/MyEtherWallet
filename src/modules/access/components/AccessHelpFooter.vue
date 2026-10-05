<template>
  <p class="text-center text-sm text-text-subtle">
    {{ $t('access_wallet.help_footer.need_help') }}
    <a
      data-testid="help-center"
      class="ml-1 font-semibold text-text-brand"
      :href="HELP_URL"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ $t('access_wallet.help_footer.go_to_help_center') }}
    </a>
  </p>
</template>

<script setup lang="ts">
// Not AppNeedHelp: that one renders only in dev mode and has the legacy layout.
const HELP_URL =
  'https://help.myetherwallet.com/en/articles/5377855-how-to-access-your-wallet-with-mew-portfolio'
</script>
