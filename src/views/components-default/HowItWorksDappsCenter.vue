<template>
  <div class="component-container">
    <div class="py-3 py-md-12" />
    <v-container>
      <v-row class="flex-column-reverse flex-lg-row">
        <v-col
          cols="12"
          lg="5"
          class="text-content pr-12 mt-12 mt-lg-0 pb-12 pb-lg-0"
        >
          <app-block-title
            no-page-title
            :data="titleData"
            class="mb-12 pl-12"
          />
          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-dapps-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">DApps Center</div>
              <p>
                Explore our integrated DApps to fully experience Ethereum’s
                capabilities. Take advantage of DeFi services with our partners
                Aave and MakerDAO, and register a domain name for your wallet
                through ENS or Unstoppable Domains. We are constantly adding
                more DApps!
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-submit-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">
                Submit Your Own DApp!
              </div>
              <p>
                MEW is dedicated to being decentralized and open-source, so we
                are excited about working with DApp developers and making DApp
                integrations easy. You can fill out your details through our
                <a
                  href="https://www.myetherwallet.com/dapp-submission"
                  target="_blank"
                  >DApp Submit Form</a
                >.
              </p>
              <!-- <div class="d-flex align-center mt-10">
                <a
                  href="#"
                  class="teal--text text--lighten-2 font-weight-medium text-decoration--underline"
                  >Watch tutorial</a
                >
              </div> -->
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="7">
          <v-img
            class="block-image"
            src="@/assets/images/snippets/new-dapps-page.png"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AppBlockTitle from '@/core/components/AppBlockTitle';

export default {
  components: { AppBlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'DApps',
      description:
        'Decentralized Applications (DApps) are what makes Ethereum special.',
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
