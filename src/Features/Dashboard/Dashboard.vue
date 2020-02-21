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
        <swap />
      </div>
    </div>
    <Spacer />
    <Dapps />
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import EthBalance from './EthBalance';
import TokensValue from './TokensValue';
import Dapps from './Dapps';

import Network from '@/layouts/Features/components/SideInfo/Network';
import Swap from '@/layouts/Features/components/SideInfo/Swap';

export default {
  components: { Spacer, EthBalance, TokensValue, Dapps, Network, Swap }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
