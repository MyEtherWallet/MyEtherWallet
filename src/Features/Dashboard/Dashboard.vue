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
    <Spacer v-if="false" />
    <Dapps v-if="false" />
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import EthBalance from './EthBalance';
import TokensValue from './TokensValue';
import Dapps from './Dapps';

import Network from '@/layouts/Features/components/SideInfo/Network';
import Swap from '@/layouts/Features/components/SideInfo/Swap';
import BannerAds from '@/layouts/Features/components/SideInfo/BannerAds';

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
