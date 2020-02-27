<template>
  <div class="component-container position--relative">
    <img
      src="@/assets/images/backgrounds/bg-bubbles.png"
      class="block-background-pattern"
    />
    <v-container>
      <v-row class="align-center">
        <v-col cols="6">
          <v-img
            class="my-8 block-image"
            src="@/assets/images/snippets/swap-page.png"
          />
        </v-col>
        <v-col cols="6" class="text-content pl-12">
          <BlockTitle :data="titleData" class="mb-8 pl-12" />
          <div class="mb-9 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/currencies/btc/icon-btc-white.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                Bitcoin
              </div>
              <p class="white--text">
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
              </p>
            </div>
          </div>

          <div class="mb-9 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/currencies/eth/icon-eth-white.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                Tokens
              </div>
              <p class="white--text">
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img
                src="@/assets/images/icons/light/white/icon-fiat-white.svg"
              />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                Fiats
              </div>
              <p class="white--text">
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
              </p>
              <div class="d-flex align-center mt-7">
                <a href="#" class="mr-5 white--text font-weight-bold"
                  >Try free demo</a
                >
                <a href="#" class="white--text font-weight-bold"
                  >Watch tutorial</a
                >
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '../../../components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Swap',
      description:
        'MEW has partnered with Bity, Kyber Network, and Simplex to allow users to swap fiat to crypto, ETH and BTC.',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
.component-container {
  background-image: linear-gradient(to right, #f09819, #f9723f);
}

.block-background-pattern {
  position: absolute;
  top: 80px;
  left: 80px;
  height: 95%;
}

.block-image {
  box-shadow: 0px 0px 20px #0000001c;
}
</style>
