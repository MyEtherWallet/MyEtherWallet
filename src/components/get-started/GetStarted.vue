<template>
  <div class="mew-component--get-started">
    <v-container>
      <div class="d-flex align-center px-6">
        <div>
          <h2 class="white--text mb-3">Ready? Get your wallet today.</h2>
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
          btn-link="/create-wallet"
          title="Get a new wallet"
          color-theme="white"
          button-size="xlarge"
          icon="newWallet"
          icon-align="left"
          icon-type="mew"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'GetStarted',
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.mew-component--get-started {
  background: linear-gradient(90deg, #24a2ca 0%, #32bfa5 100%);
  padding: 80px 0;
}
</style>

<style lang="scss">
.mew-component--get-started {
  .v-btn {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1) !important;
    height: 70px !important;
    .icon img {
      height: 50px;
      margin-right: 5px;
    }
  }
}
</style>
