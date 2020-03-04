<template>
  <div class="light-blue darken-4 position--relative">
    <div class="pointer-event--none user-select--none line-height--0">
      <img
        class="banner-img"
        src="@/assets/images/Banners/LandingPage/homepage-top-banner.svg"
      />
    </div>
    <v-container class="banner-content-container">
      <v-row no-gutters>
        <v-col>
          <v-card color="transparent" flat tile max-width="510">
            <div
              class="white--text display-2 font-weight-bold banner-line-height"
            >
              The most popular free Ethereum wallet
            </div>
            <p class="white--text mt-3">
              Generate the free Ethereum wallet, and interact with the Ethereum
              blockchain easily and securely.
            </p>
            <div class="mt-7">
              <StdButton
                buttonclass="button--green"
                class="mr-4"
                :to="{ name: 'HomeCreateWallet' }"
                >Get a new wallet</StdButton
              >
              <StdButton
                buttonclass="button--green-border"
                :to="{ name: 'HomeAccessWallet' }"
                >Access my wallet</StdButton
              >
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import StdButton from '@/components/StdButton';

export default {
  name: 'HomeContainer',
  components: {
    StdButton
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.banner-img {
  width: 100%;
}
.banner-content-container {
  height: 400px;
  position: absolute;
  top: 14vw;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.banner-line-height {
  line-height: 55px !important;
}
</style>
