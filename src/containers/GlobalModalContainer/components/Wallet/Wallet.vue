<template>
  <div>
    <WooCommerce
      :open="openWalletWooCommerce"
      :close="closeWalletWooCommerce"
    />
  </div>
</template>

<script>
import WooCommerce from './WooCommerce';

export default {
  components: {
    WooCommerce
  }
};
</script>
