<template>
  <div>
    <v-container>
      <BlockTitle
        centered
        toptitle="Features"
        title="All-in-one gateway to your Ethereum Blockchain service"
      />
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
import Tabs from '@/layouts/components/Tabs';
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  name: 'HomeFeatures',
  components: {
    Tabs,
    BlockTitle
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

.v-tab {
  text-transform: initial;
  font-weight: 700;
  color: $disabled--2;
  min-width: 120px;
}

.tab-image {
  padding-top: 50px;
  width: 100%;
}
</style>
