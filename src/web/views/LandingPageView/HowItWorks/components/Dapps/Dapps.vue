<template>
  <div class="component-container">
    <div class="py-9" />
    <v-container>
      <v-row class="align-center">
        <v-col cols="5" class="text-content pr-12">
          <BlockTitle no-page-title :data="titleData" class="mb-12 pl-12" />
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

        <v-col cols="7">
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
import BlockTitle from '@/web/components/BlockTitle';

export default {
  components: { BlockTitle },
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
