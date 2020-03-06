<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <EthBalance />
        <Spacer />
        <TokensValue />
      </div>
      <Spacer />
      <div>
        <Network />
        <Spacer />
        <Swap />
        <Spacer />
        <BannerAds />
      </div>
    </div>
    <Spacer />
    <Dapps />
  </div>
</template>

<script>
import Spacer from '@/web/components/Common/Spacer';
import EthBalance from './containers/EthBalance';
import TokensValue from './containers/TokensValue';
import Dapps from './containers/Dapps';

import Network from '@/web/components/Network';
import Swap from '@/web/components/Swap';
import BannerAds from '@/web/components/BannerAds';

export default {
  components: {
    Spacer,
    EthBalance,
    TokensValue,
    Dapps,
    Network,
    Swap,
    BannerAds
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
