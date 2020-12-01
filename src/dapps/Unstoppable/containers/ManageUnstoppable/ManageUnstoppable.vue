<template>
  <div class="unstoppable-container">
    <router-view
      :account="account"
      :web3="web3"
      :domain-name="domainName"
      :set-domain="setDomain"
    />
  </div>
</template>

<script>
import '@stripe/stripe-js';
import { mapState } from 'vuex';

export default {
  props: {
    setDomain: {
      type: Function,
      default: () => {}
    },
    domainName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account'])
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageUnstoppable.scss';
</style>
