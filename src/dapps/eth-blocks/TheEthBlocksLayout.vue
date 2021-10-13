<template>
  <!--
    ===================================================
    The Staked Layout
    ===================================================
    -->
  <the-wrapper-dapp
    :is-new-header="true"
    :dapp-img="headerImg"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    top-strip
  >
    <!--
    ===================================================
    New Stake Tab
    ===================================================
    -->
    <template #tabContent1>
      <p>Tab1</p>
    </template>
    <!--
    ===================================================
    My Stake tab
    ===================================================
    -->
    <template #tabContent2>
      <p>Tab2</p>
    </template>
  </the-wrapper-dapp>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';

export default {
  name: 'TheEthBlocksLayout',
  components: {
    TheWrapperDapp
  },
  data() {
    return {
      header: {
        title: 'Eth Blocks',
        subtext: 'Mint stunning QR art-pieces based on your favorite blocks.'
      },
      activeTab: 0,
      tabs: [{ name: 'Tab1' }, { name: 'Tab2' }],
      headerImg: require('@/assets/images/icons/icon-dapp-eth-blocks.svg')
    };
  }
};
</script>

<style lang="scss" scoped>
.staked-tab-inactive {
  background-color: rgba(0, 0, 0, 0.24) !important;
}
.staked-tab-active::before {
  opacity: 0 !important;
}
</style>
