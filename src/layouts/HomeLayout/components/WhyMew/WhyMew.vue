<template>
  <div class="home-why-mew">
    <v-container>
      <BlockTitle
        :centered="false"
        title="Why Mew"
        description="Make Ethereum Blockchain easy and secure"
      />
      <FriendlyToUse> </FriendlyToUse>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '../Common/BlockTitle';
import FriendlyToUse from './components/FriendlyToUse';

export default {
  name: 'HomeFeatures',
  components: {
    BlockTitle,
    FriendlyToUse
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
