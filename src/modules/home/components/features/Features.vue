<template>
  <div class="features-container">
    <v-sheet color="transparent" max-width="400px" class="mx-auto text-center">
      <div class="mew-heading-3 text-uppercase textPrimary--text mb-1">
        Features
      </div>
      <h2 class="mb-9">
        All-in-one gateway to your Ethereum Blockchain service
      </h2>
    </v-sheet>
    <mew-tabs
      class="mew-tabs-container d-flex align-center flex-column"
      :items="mewTabs"
      is-block
    >
      <template v-slot:tabContent1>
        <img
          class="pt-8"
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
      <template v-slot:tabContent2>
        <img
          class="pt-8"
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
      <template v-slot:tabContent2>
        <img
          class="pt-8"
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
      <template v-slot:tabContent3>
        <img
          class="pt-8"
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
    </mew-tabs>
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
.features-container {
  .mew-tabs-container {
    .v-tabs {
      width: 50%;
    }
    img {
      width: 100%;
    }
  }
}
</style>
