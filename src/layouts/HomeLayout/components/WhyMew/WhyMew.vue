<template>
  <div class="home-why-mew">
    <v-container>
      <BlockTitle
        :centered="false"
        title="Why Mew"
        description="Make Ethereum Blockchain easy and secure"
      />
    </v-container>
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
