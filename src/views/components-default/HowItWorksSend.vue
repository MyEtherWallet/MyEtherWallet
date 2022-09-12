<template>
  <div>
    <div class="py-3 py-md-7" />
    <v-container class="pb-12 pb-lg-0">
      <v-row class="flex-column-reverse flex-lg-row">
        <v-col cols="12" lg="5" class="text-content pr-12 mt-4 mt-lg-0">
          <app-block-title
            no-page-title
            :data="titleData"
            class="mb-12 pl-12"
          />
          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-send-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">
                {{
                  $t('howItWorks.send-funds.info-one.title')
                    | lokalise('howItWorks.send-funds.info-one.title')
                }}
              </div>
              <p>
                {{ $t('howItWorks.send-funds.info-one.text') }}
              </p>
            </div>
          </div>

          <div class="mb-4 d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-nft-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">
                {{
                  $t('howItWorks.send-funds.info-two.title')
                    | lokalise('howItWorks.send-funds.info-two.title')
                }}
              </div>
              <p>
                {{
                  $t('howItWorks.send-funds.info-two.text')
                    | lokalise('howItWorks.send-funds.info-two.text')
                }}
              </p>
            </div>
          </div>

          <div class="d-flex">
            <div class="mr-3">
              <v-img src="@/assets/images/icons/icon-offline-mew.svg" />
            </div>
            <div>
              <div class="mb-1 font-weight-bold subtitle-1">
                {{
                  $t('howItWorks.send-funds.info-three.title')
                    | lokalise('howItWorks.send-funds.info-three.title')
                }}
              </div>
              <p>
                {{
                  $t('howItWorks.send-funds.info-three.text')
                    | lokalise('howItWorks.send-funds.info-three.text')
                }}
              </p>
              <!-- <div class="d-flex align-center mt-10">
                <a
                  href="#"
                  class="mr-5 teal--text text-decoration--underline text--lighten-2 font-weight-medium"
                >
                  Watch tutorial
                </a>
              </div> -->
            </div>
          </div>
        </v-col>
        <v-col cols="12" lg="7">
          <v-img
            src="@/assets/images/snippets/send-tx-page.jpg"
            class="mt-n6"
          />
        </v-col>
      </v-row>
    </v-container>
    <div class="py-2 py-md-9" />
  </div>
</template>

<script>
export default {
  components: {
    AppBlockTitle: () => import('@/core/components/AppBlockTitle')
  },
  data: vm => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: vm.$t('howItWorks.send-funds.title'),
      description: vm.$t('howItWorks.send-funds.description'),
      centered: false
    }
  })
};
</script>
