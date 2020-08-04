<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <eth-balance />
        <spacer />
        <no-balance />
        <spacer />
        <tokens-value />
        <spacer />
        <no-tokens />
      </div>
      <spacer />
      <div>
        <network />
        <spacer />
        <swap />
        <spacer />
        <banner-ads />
      </div>
    </div>
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import EthBalance from './EthBalance';
import NoBalance from './NoBalance';
import TokensValue from './TokensValue';
import NoTokens from './NoTokens';
import Network from '@/components/Network';
import Swap from '@/components/Swap';
import BannerAds from '@/components/BannerAds';

export default {
  components: {
    spacer: Spacer,
    'eth-balance': EthBalance,
    'no-balance': NoBalance,
    'tokens-value': TokensValue,
    'no-tokens': NoTokens,
    network: Network,
    swap: Swap,
    'banner-ads': BannerAds
  }
};
</script>
