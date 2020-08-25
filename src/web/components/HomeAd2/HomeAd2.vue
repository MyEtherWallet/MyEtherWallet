<template>
  <div class="ad2">
    <v-container>
      <div class="d-flex align-center px-6">
        <div>
          <h2 class="white--text mb-3">
            Ready? Get your wallet today.
          </h2>
          <p class="white--text ma-0">
            Still don't know what MEW is?
            <a
              class="color--inherit font-weight-medium text-decoration--underline"
              href="https://kb.myetherwallet.com/"
              target="_blank"
            >
              Learn more
            </a>
          </p>
        </div>
        <v-spacer />
        <mew-button
          btn-link="/"
          :has-full-width="false"
          title="Get a new wallet"
          color-theme="white"
          button-size="xlarge"
          :icon="icon"
          icon-align="left"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import walletIcon from '@/assets/images/icons/icon-wallet-mew.png';

export default {
  name: 'HomeAd2',
  components: {},
  data() {
    return {
      icon: walletIcon
    };
  }
};
</script>

<style lang="scss" scoped>
.ad2 {
  background: linear-gradient(90deg, #24a2ca 0%, #32bfa5 100%);
  padding: 80px 0;
}

.standard-button {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1) !important;
  height: 76px !important;
  min-width: 253px !important;
}
</style>
