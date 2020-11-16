<template>
  <div class="component-container">
    <v-container>
      <div class="py-7" />

      <v-sheet color="transparent" max-width="500px" class="mx-auto mb-10">
        <div class="display-1 font-weight-bold text-sm-center">
          All-in-one gateway to your Ethereum Blockchain service
        </div>
      </v-sheet>
      <v-row class="flex-column-reverse flex-lg-row align-center">
        <v-col
          cols="12"
          lg="5"
          class="text-content pr-12 mt-12 mt-lg-0 pb-12 pb-lg-0"
        >
          <block-title no-page-title :data="titleData" class="mb-12 pl-12" />
          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-dapps-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">Dapps Center</div>
              <p>
                MEW has pasrtnered with Bity, Kyber Network, and Simplex to
                allow users to swap fiat to crypto, ETH and BTC.
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-submit-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">Submit</div>
              <p>
                Dolor tempor ipsum lorem sadipscing, erat sadipscing et dolor
                sed stet takimata ipsum invidunt, est ea no dolor.
              </p>
              <div class="d-flex align-center mt-10">
                <a
                  href="#"
                  class="teal--text text--lighten-2 font-weight-medium text-decoration--underline"
                  >Watch tutorial</a
                >
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="7">
          <v-img
            class="block-image"
            src="@/assets/images/snippets/new-dapps-page.png"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  components: { blockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'Dapps',
      description:
        'At dolor et sit erat lorem at, dolor magna sed eirmod eos magna takimata ipsum.',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
.block-image {
  box-shadow: 0px 0px 20px #0000001c;
  margin-bottom: -23px;
}
</style>
