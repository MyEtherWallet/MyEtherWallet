<template>
  <div>
    <v-container>
      <BlockTitle :data="titleData" />
    </v-container>
    <div class="tab-container pt-7 text-center">
      <mew-tabs :items="tabNames" is-block="true">
        <template v-slot:tabContent0>
          <div>
            <img
              class="tab-image"
              src="@/assets/images/backgrounds/bg-swap-page.svg"
            />
          </div>
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
    tabNames: [
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

<style lang="scss" scoped>
.tab-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 450px;
  width: 100%;
}
.tab-image {
  padding-top: 50px;
  width: 100%;
}
</style>
