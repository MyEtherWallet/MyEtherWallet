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
import Spacer from '@/components/Common/Spacer';
import SendTransaction from './SendTransaction';

import Network from '@/components/Network';
import Swap from '@/components/Swap';

export default {
  components: {
    Spacer,
    SendTransaction,
    Network,
    Swap
  }
};
</script>
