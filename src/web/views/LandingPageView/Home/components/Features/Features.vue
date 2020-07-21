<template>
  <div class="features-container">
    <div class="flex-column d-flex align-center">
      <span class="mew-heading-3 text-uppercase textPrimary--text pb-3">
        Features
      </span>
      <span class="mew-subtitle pb-7">
        All-in-one gateway to your Ethereum Blockchain service
      </span>
    </div>
    <mew-tabs
      class="mew-tabs-container d-flex align-center flex-column"
      :items="mewTabs"
      is-block
    >
      <template v-slot:tabContent0>
        <img
          class="pt-8"
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
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
