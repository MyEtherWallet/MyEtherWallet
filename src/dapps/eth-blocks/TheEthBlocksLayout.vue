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
  </the-wrapper-dapp>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import { ETH_BLOCKS_ROUTE } from './configsRoutes';
export default {
  name: 'TheEthBlocksLayout',
  components: {
    TheWrapperDapp
  },
  data() {
    return {
      header: {
        title: 'ETH Blocks',
        subtext: 'Mint stunning QR art-pieces based on your favorite blocks.'
      },
      activeTab: 0,
      tabs: [
        {
          name: 'Mint a new block',
          route: { name: ETH_BLOCKS_ROUTE.CORE.NAME }
        },
        {
          name: 'My blocks',
          route: {
            name: ETH_BLOCKS_ROUTE.MY_BLOCKS.NAME
          }
        }
      ],
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
