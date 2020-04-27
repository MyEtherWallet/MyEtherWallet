<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <EthBalance />
        <NoBalance />
        <Spacer />
        <TokensValue />
        <NoTokens />
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
import Spacer from '@/web/components/Common/Spacer';
import EthBalance from './containers/EthBalance';
import NoBalance from './containers/NoBalance';
import TokensValue from './containers/TokensValue';
import NoTokens from './containers/NoTokens';
import Dapps from './containers/Dapps';

import Network from '@/web/components/Network';
import Swap from '@/web/components/Swap';
import BannerAds from '@/web/components/BannerAds';

export default {
  components: {
    Spacer,
    EthBalance,
    NoBalance,
    TokensValue,
    NoTokens,
    Dapps,
    Network,
    Swap,
    BannerAds
  }
};
</script>
