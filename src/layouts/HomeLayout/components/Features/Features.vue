<template>
  <div class="py-12">
    <v-container>
      <BlockTitle
        centered
        title="Features"
        description="All-in-one gateway to your Ethereum Blockchain service"
      />
    </v-container>
    <div class="pt-7">
      <v-tabs color="deep-purple accent-4" centered>
        <v-tab class="px-12 ">Send</v-tab>
        <v-tab class="px-12">Swap</v-tab>
        <v-tab class="px-12">Dapps</v-tab>
        <v-tab class="px-12">Tokens</v-tab>

        <v-tab-item class="mt-10">
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
        <v-tab-item class="mt-10">
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
        <v-tab-item class="mt-10">
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
        <v-tab-item class="mt-10">
          <img
            class="tab-image"
            src="@/assets/images/Banners/LandingPage/Features/Swap.svg"
          />
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>

<script>
//import Flexbox from '@/components/Common/Flexbox';
//import StdButton from '@/components/StdButton';
import BlockTitle from '../Common/BlockTitle';

export default {
  name: 'HomeFeatures',
  components: {
    //Flexbox,
    //StdButton,
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
}

.tab-image {
  width: 100%;
}
</style>
