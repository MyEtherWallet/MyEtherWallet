<template>
  <div>
    <h3 class="text-center my-4">
      {{ $t('createWallet.mew-wallet.redirect-store') }}
    </h3>
  </div>
</template>

<script>
import { Misc } from '@/helpers';

export default {
  data() {
    const downloadMEWWalletApp = Misc.downloadMEWWalletApp;
    return {
      downloadMEWWalletApp: downloadMEWWalletApp
    };
  },
  mounted() {
    this.downloadMEWWalletApp();
  }
};
</script>
