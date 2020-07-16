<template>
  <div id="id-6430f8d188c5d2f27112340e0c988fd2">
    <v-container>
      <mew-module
        title-size="mew-heading-1"
        title="All-in-one gateway to your Ethereum Blockchain service"
        subtitle="FEATURES"
      />
    </v-container>
    <mew-tabs :items="mewTabs" is-block>
      <template v-slot:tabContent0>
        <img
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
      <template v-slot:tabContent1>
        <img
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
      <template v-slot:tabContent2>
        <img
          :src="require('@/assets/images/backgrounds/bg-swap-page.svg')"
          alt="Swap"
        />
      </template>
      <template v-slot:tabContent3>
        <img
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
#id-6430f8d188c5d2f27112340e0c988fd2 {
  img {
    width: 100%;
  }
}
</style>
