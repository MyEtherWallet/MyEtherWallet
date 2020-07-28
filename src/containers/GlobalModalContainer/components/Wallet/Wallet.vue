<template>
  <div>
    <WooCommerce
      :open="openWalletWooCommerce"
      :close="closeWalletWooCommerce"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WooCommerce from './WooCommerce';

export default {
  components: {
    WooCommerce
  },
  computed: mapState({
    openWalletWooCommerce: state => state.modals.walletWooCommerce.isOpen
  }),
  methods: {
    closeWalletWooCommerce() {
      this.$store.commit('closeModal', 'walletWooCommerce');
    }
  }
};
</script>
