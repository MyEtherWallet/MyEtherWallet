<template>
  <div>
    <b-navbar class="extension-header-container">
      <b-navbar-brand to="/" class="brand-container">
        <img
          :src="require(`@/assets/images/short-hand-logo-${buildType}.png`)"
          height="40"
        />
        <div class="brand-border" />
        <span> Chrome Extension </span>
      </b-navbar-brand>
      <b-nav class="extension-links">
        <b-nav-item href="https://www.myetherwallet.com" target="_blank">
          Home
        </b-nav-item>
        <b-nav-item href="https://kb.myetherwallet.com" target="_blank">
          Help Center
        </b-nav-item>
        <b-nav-item
          v-show="account.address !== null"
          target="_blank"
          @click="logout"
        >
          Logout
        </b-nav-item>
      </b-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      buildType: BUILD_TYPE
    };
  },
  computed: {
    ...mapState(['account'])
  },
  methods: {
    logout() {
      this.$store.dispatch('clearWallet');
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionHeaderContainer.scss';
</style>
