<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <SendTransaction />
      </div>
      <Spacer />
      <div>
        <Network />
        <Spacer />
        <Swap />
      </div>
    </div>
  </div>
</template>

<script>
import Spacer from '@/web/components/Common/Spacer';
import SendTransaction from './SendTransaction';

import Network from '@/layouts/Features/components/SideInfo/Network';
import Swap from '@/layouts/Features/components/SideInfo/Swap';

export default {
  components: {
    Spacer,
    SendTransaction,
    Network,
    Swap
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
