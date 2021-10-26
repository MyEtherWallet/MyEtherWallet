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
    :valid-networks="validNetworks"
    top-strip
  >
  </the-wrapper-dapp>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import { ETH_BLOCKS_ROUTE } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  name: 'TheEthBlocksLayout',
  components: {
    TheWrapperDapp
  },
  data() {
    return {
      header: {
        title: 'ETH Blocks',
        subtext: 'Mint generative art NFTs of Ethereum blocks. '
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
      headerImg: require('@/assets/images/icons/icon-dapp-eth-blocks.svg'),
      validNetworks: SUPPORTED_NETWORKS
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
