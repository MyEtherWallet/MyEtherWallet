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

import Network from '@/web/components/Network';
import Swap from '@/web/components/Swap';

export default {
  components: {
    Spacer,
    SendTransaction,
    Network,
    Swap
  }
};
</script>
