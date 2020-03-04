<template>
  <div>
    <v-container>
      <BlockTitle :data="titleData" />
    </v-container>
    <div class="pt-7">
      <Tabs>
        <v-tab>Send</v-tab>
        <v-tab>Swap</v-tab>
        <v-tab>Dapps</v-tab>
        <v-tab>Tokens</v-tab>

        <v-tab-item>
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
        <v-tab-item>
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
        <v-tab-item>
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
        <v-tab-item>
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
      </Tabs>
    </div>
  </div>
</template>

<script>
import Tabs from '../../../components/Tabs';
import BlockTitle from '../../../components/BlockTitle';

export default {
  name: 'HomeFeatures',
  components: {
    Tabs,
    BlockTitle
  },
  data: () => ({
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
.tab-image {
  padding-top: 50px;
  width: 100%;
}
</style>
