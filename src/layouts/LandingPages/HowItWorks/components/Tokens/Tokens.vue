<template>
  <div class="component-container position--relative">
    <div class="py-12" />
    <img
      src="@/assets/images/backgrounds/bg-waves.svg"
      class="block-background-pattern"
    />
    <v-container>
      <v-row class="align-center">
        <v-col cols="7">
          <v-img
            src="@/assets/images/snippets/my-tokens-table.png"
            class="mb-n7"
          />
        </v-col>
        <v-col cols="5" class="text-content pl-12">
          <BlockTitle :data="titleData" class="mb-8 pl-12" />
          <div class="mb-9 d-flex">
            <div class="mr-3">
              <v-img
                src="@/assets/images/icons/light/white/icon-buy-token-white.svg"
              />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                Buy Tokens
              </div>
              <p class="white--text">
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/currencies//icon-eth-white.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                Add My Tokens
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
    <div class="py-12" />
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
      title: 'Tokens',
      description:
        'MEW has partnered with Bity, Kyber Network, and Simplex to allow users to swap fiat to crypto, ETH and BTC.',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
.component-container {
  background-image: linear-gradient(to right, #5378fc, #2091af);
}

.block-background-pattern {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
}
</style>
