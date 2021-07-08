<template>
  <div class="component-container position--relative">
    <img
      src="@/assets/images/backgrounds/bg-waves.svg"
      class="block-background-pattern"
    />
    <div class="py-6 py-md-12" />
    <v-container>
      <v-row>
        <v-col cols="12" lg="7">
          <v-img
            src="@/assets/images/snippets/my-tokens-table.svg"
            class="mb-n7"
          />
        </v-col>
        <v-col cols="12" lg="5" class="text-content pl-lg-12 mt-12 mt-lg-0">
          <app-block-title
            no-page-title
            :data="titleData"
            class="mb-12 pl-12"
          />
          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-buy-token-white.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                Buy Tokens
              </div>
              <p class="white--text">
                Swap for ERC20 tokens and stablecoins through our decentralized
                providers.
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/currencies/icon-eth-white.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1 white--text">
                Custom Tokens
              </div>
              <p class="white--text">
                MEW automatically supports most ERC20 tokens through our API,
                but if you don’t see the token you’re looking for, you can add
                it as a custom token right in the interface!
              </p>
              <!-- <div class="d-flex align-center mt-10">
                <a
                  href="#"
                  class="white--text font-weight-medium text-decoration--underline"
                  >Watch tutorial</a
                >
              </div> -->
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <div class="py-6 py-md-12" />
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';

export default {
  components: { AppBlockTitle },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Tokens',
      description: 'If it is on Ethereum you can manage it with MEW.',
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
