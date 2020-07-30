<template>
  <div class="bg_blue">
    <div class="pointer-event--none user-select--none line-height--0">
      <img
        class="banner-img"
        src="@/assets/images/backgrounds/bg-homepage-spaceman.svg"
      />
    </div>
    <v-container class="banner-content-container">
      <v-row no-gutters>
        <v-col>
          <v-card color="transparent" flat tile max-width="430px">
            <div class="white--text font-weight-bold banner-top-title">
              Ethereum's Original Wallet
            </div>
            <p class="white--text mt-3">
              MEW (MyEtherWallet) is a free, client-side interface helping you
              interact with the Ethereum blockchain. Our easy-to-use,
              open-source platform allows you to generate wallets, interact with
              smart contracts, and so much more.
            </p>
            <div class="mt-9 d-flex">
              <mew-button
                class="mr-3"
                :has-full-width="false"
                title="Create a new wallet"
                button-size="xlarge"
                @click.native="goTo('HomeCreateWallet')"
              />
              <mew-button
                :has-full-width="false"
                btn-style="outline"
                title="Access my wallet"
                button-size="xlarge"
                @click.native="goTo('HomeAccessWallet')"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HomeContainer',
  components: {},
  methods: {
    goTo(param) {
      this.$router.push({
        name: param
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
}
.banner-top-title {
  line-height: 55px !important;
  font-size: 50px;
}
</style>
