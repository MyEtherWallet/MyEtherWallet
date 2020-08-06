<template>
  <div>
    <woo-commerce
      :open="openWalletWooCommerce"
      :close="closeWalletWooCommerce"
    />
  </div>
</template>

<script>
import wooCommerce from './WooCommerce/WooCommerce';

export default {
  components: {
    wooCommerce
  }
};
</script>
