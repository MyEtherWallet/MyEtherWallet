<template>
  <div class="home-why-mew">
    <v-container>
      <BlockTitle
        :centered="false"
        title="Why Mew"
        description="Make Ethereum Blockchain easy and secure"
      />
      <div class="pt-10 d-flex">
        <FriendlyToUse class="mr-10" />
        <div>
          <Swap class="mb-10" />
          <HardwareWallet />
        </div>
        <SecureMyFunds class="ml-10" />
      </div>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '../Common/BlockTitle';
import FriendlyToUse from './components/FriendlyToUse';
import Swap from './components/Swap';
import HardwareWallet from './components/HardwareWallet';
import SecureMyFunds from './components/SecureMyFunds';

export default {
  name: 'HomeFeatures',
  components: {
    BlockTitle,
    FriendlyToUse,
    Swap,
    HardwareWallet,
    SecureMyFunds
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
