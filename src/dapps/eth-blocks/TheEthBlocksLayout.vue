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
      <module-eth-blocks-mint />
    </template>
    <!--
    ===================================================
    My Stake tab
    ===================================================
    -->
    <template #tabContent2>
      <p>Tab2</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </template>
  </the-wrapper-dapp>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import ModuleEthBlocksMint from './modules/ModuleEthBlocksMint.vue';
export default {
  name: 'TheEthBlocksLayout',
  components: {
    TheWrapperDapp,
    ModuleEthBlocksMint
  },
  data() {
    return {
      header: {
        title: 'ETH Blocks',
        subtext: 'Mint stunning QR art-pieces based on your favorite blocks.'
      },
      activeTab: 0,
      tabs: [{ name: 'Mint a new block' }, { name: 'My blocks' }],
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
