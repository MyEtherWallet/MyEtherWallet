<template>
  <div class="mew-component--features">
    <v-sheet color="transparent" max-width="400px" class="mx-auto text-center">
      <div class="mew-heading-3 text-uppercase textPrimary--text mb-1">
        Features
      </div>
      <h2 class="mb-9">
        All-in-one gateway to your Ethereum Blockchain service
      </h2>
    </v-sheet>
    <div class="features-tabs-container">
      <v-container>
        <mew-tabs
          class="mew-tabs-container d-flex align-center flex-column"
          :items="mewTabs"
          is-block
        >
          <template v-slot:tabContent1>
            <img
              class="pt-7 tab-image-content"
              :src="require('@/assets/images/backgrounds/bg-send-page.png')"
              alt="Send"
            />
          </template>
          <template v-slot:tabContent2>
            <img
              class="pt-7 tab-image-content"
              :src="require('@/assets/images/backgrounds/bg-swap-page.png')"
              alt="Swap"
            />
          </template>
          <template v-slot:tabContent2>
            <img
              class="pt-7 tab-image-content"
              :src="require('@/assets/images/backgrounds/bg-dapps-page.png')"
              alt="Dapps"
            />
          </template>
          <template v-slot:tabContent3>
            <img
              class="pt-7 tab-image-content"
              :src="require('@/assets/images/backgrounds/bg-tokens-page.png')"
              alt="tokens"
            />
          </template>
        </mew-tabs>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeFeatures',
  components: {},
  data: () => ({
    mewTabs: [
      {
        name: 'Send'
      },
      {
        name: 'Swap'
      },
      {
        name: 'Dapps'
      },
      {
        name: 'Tokens'
      }
    ]
  })
};
</script>

<style lang="scss">
.mew-component--features {
  .features-tabs-container {
    background-image: url(../../../../assets/images/backgrounds/bg-waves-color.png);
    background-size: contain;
    background-position: bottom center;
  }

  .tab-image-content {
    max-width: 70%;
    margin: 0 auto;
    display: block;
  }
}
</style>
