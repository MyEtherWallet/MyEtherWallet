<template>
  <v-container>
    <BlockTitle
      title="Features"
      description="All-in-one gateway to your Ethereum Blockchain service"
    />
  </v-container>
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
</style>
