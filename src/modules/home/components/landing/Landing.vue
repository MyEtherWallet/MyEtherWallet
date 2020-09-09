<template>
  <div class="mew-component--landing">
    <div class="desktop-content d-none d-lg-block expandHeader">
      <div class="pointer-event--none user-select--none line-height--0">
        <img
          class="banner-img"
          src="@/assets/images/backgrounds/bg-homepage-spaceman.svg"
        />
      </div>
      <v-container class="banner-content-container">
        <v-card color="transparent" flat tile max-width="430px">
          <div class="white--text font-weight-bold banner-top-title">
            Ethereum's Original Wallet
          </div>
          <p class="white--text mt-3">
            MEW (MyEtherWallet) is a free, client-side interface helping you
            interact with the Ethereum blockchain. Our easy-to-use, open-source
            platform allows you to generate wallets, interact with smart
            contracts, and so much more.
          </p>
          <div class="mt-9 d-flex">
            <mew-button
              class="mr-3"
              :has-full-width="false"
              title="Create a new wallet"
              button-size="xlarge"
              @click.native="$router.push({ name: 'CreateWallet', params: {} })"
            />
            <mew-button
              :has-full-width="false"
              btn-style="outline"
              title="Access my wallet"
              button-size="xlarge"
              @click.native="$router.push({ name: 'AccessWallet', params: {} })"
            />
          </div>
        </v-card>
      </v-container>
    </div>
    <div class="mobile-content d-block d-lg-none expandHeader">
      <v-container>
        <v-card color="transparent" flat tile max-width="430px">
          <h1 class="white--text font-weight-bold banner-top-title">
            Ethereum's Original Wallet
          </h1>
          <p class="white--text mt-3">
            MEW (MyEtherWallet) is a free, client-side interface helping you
            interact with the Ethereum blockchain. Our easy-to-use, open-source
            platform allows you to generate wallets, interact with smart
            contracts, and so much more.
          </p>
          <div class="mt-9">
            <mew-button
              class="mb-4 width--full"
              :has-full-width="false"
              title="Create a new wallet"
              button-size="xlarge"
              @click.native="$router.push({ name: 'CreateWallet', params: {} })"
            />
            <mew-button
              class="width--full"
              :has-full-width="false"
              btn-style="outline"
              title="Access my wallet"
              button-size="xlarge"
              @click.native="$router.push({ name: 'AccessWallet', params: {} })"
            />
          </div>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  components: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.desktop-content {
  .banner-img {
    width: 100%;
  }
  .banner-content-container {
    height: 400px;
    position: absolute;
    top: 300px;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 1;
  }
  .banner-top-title {
    line-height: 55px !important;
    font-size: 50px;
  }
}

.mobile-content {
  background-image: url('~@/assets/images/backgrounds/bg-homepage-spaceman.svg');
  padding: 0 0 20rem 0;
}
</style>
