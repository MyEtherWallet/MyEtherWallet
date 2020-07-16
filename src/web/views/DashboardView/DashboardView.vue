<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <EthBalance />
        <Spacer />
        <NoBalance />
        <Spacer />
        <TokensValue />
        <Spacer />
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
  </div>
</template>

<script>
import Spacer from '@/web/components/Common/Spacer';
import EthBalance from './containers/EthBalance';
import NoBalance from './containers/NoBalance';
import TokensValue from './containers/TokensValue';
import NoTokens from './containers/NoTokens';
import Network from '@/web/components/Network';
import Swap from '@/web/components/Swap';
import BannerAds from '@/components/BannerAds';

export default {
  components: {
    Spacer,
    EthBalance,
    NoBalance,
    TokensValue,
    NoTokens,
    Network,
    Swap,
    BannerAds
  }
};
</script>
