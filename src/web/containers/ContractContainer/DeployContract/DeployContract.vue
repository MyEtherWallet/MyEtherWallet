<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <Deploy />
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
import Deploy from './Deploy';

import Network from '@/web/components/Network';
import Swap from '@/web/components/Swap';

export default {
  components: {
    Spacer,
    Deploy,
    Network,
    Swap
  }
};
</script>
