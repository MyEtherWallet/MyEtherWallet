<template>
  <div class="light-blue darken-4 home-top-banner">
    <div class="pointer-event--none user-select--none line-height--0">
      <img
        class="banner-img"
        src="@/assets/images/Banners/LandingPage/homepage-top-banner.svg"
      />
    </div>
    <v-container class="banner-content-container">
      <v-row no-gutters>
        <v-col>
          <v-card color="transparent" flat tile max-width="500">
            <div class="white--text display-2 font-weight-bold">
              The most popular free Ethereum wallet
            </div>
            <div class="white--text mt-3">
              Generate the free Ethereum wallet, and interact with the Ethereum
              blockchain easily and securely.
            </div>
            <Flexbox class="mt-7">
              <StdButton buttonclass="button--green" class="mr-4">
                Get a new wallet
              </StdButton>

              <StdButton buttonclass="button--green-border">
                Access my wallet
              </StdButton>
            </Flexbox>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Flexbox from '@/components/Common/Flexbox';
import StdButton from '@/components/StdButton';

export default {
  name: 'HomeContainer',
  components: {
    Flexbox,
    StdButton
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

.home-top-banner {
  position: relative;
}
.banner-img {
  width: 100%;
}
.banner-content-container {
  height: 400px;
  position: absolute;
  top: 12vw;
  left: 0;
  right: 0;
  margin: 0 auto;
}
</style>
