<template>
  <div>
    <v-container>
      <BlockTitle
        :data="titleData"
        :centered="false"
        toptitle="Why Mew"
        title="Make Ethereum Blockchain easy and secure"
      />
      <div class="pt-10 d-flex">
        <FriendlyToUse class="box-shadow mr-10" />
        <div>
          <Swap class="box-shadow mb-10" />
          <HardwareWallet class="box-shadow" />
        </div>
        <SecureMyFunds class="box-shadow ml-10" />
      </div>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import FriendlyToUse from './components/FriendlyToUse';
import Swap from './components/Swap';
import HardwareWallet from './components/HardwareWallet';
import SecureMyFunds from './components/SecureMyFunds';

export default {
  name: 'HomeWhyMew',
  components: {
    BlockTitle,
    FriendlyToUse,
    Swap,
    HardwareWallet,
    SecureMyFunds
  },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: 'Why Mew',
      title: 'Make Ethereum Blockchain easy and secure',
      description: '',
      centered: false
    }
  })
};
</script>

<style lang="scss" scoped>
.box-shadow {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
}
</style>
