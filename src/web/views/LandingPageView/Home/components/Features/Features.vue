<template>
  <div>
    <v-container>
      <BlockTitle :data="titleData" />
    </v-container>
    <div class="tab-lp-container pt-6 text-center">
      <mew-tabs :items="tabs" :is-block="true">
        <template v-slot:tabContent0>
          <p>THIS NEEDS SEND IMG</p>
        </template>
        <template v-slot:tabContent1>
          <img
            class="tab-image"
            height="500"
            src="@/assets/images/backgrounds/bg-swap-page.svg"
          />
        </template>
        <template v-slot:tabContent2>
          <p>THIS NEEDS DAPP IMG</p>
        </template>
        <template v-slot:tabContent3>
          <p>THIS NEEDS TOKENS IMG</p>
        </template>
      </mew-tabs>
    </div>
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';

export default {
  name: 'HomeFeatures',
  components: {
    BlockTitle
  },
  data: () => ({
    tabs: [
      { name: 'Send' },
      { name: 'Swap' },
      { name: 'Dapps' },
      { name: 'Tokens' }
    ],
    titleData: {
      textProps: '',
      toptitle: 'Features',
      title: 'All-in-one gateway to your Ethereum Blockchain service',
      description: '',
      centered: true
    }
  })
};
</script>

<style lang="scss">
.tab-lp-container {
  margin-left: auto;
  margin-right: auto;

  .mew-tabs-block {
    margin-left: auto;
    margin-right: auto;
    max-width: 450px !important;
    width: 100%;
  }

  .tab-image {
    padding-top: 50px;
    width: 100%;
  }
}
</style>
