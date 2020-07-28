<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <Interact />
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
import Interact from './Interact';

import Network from '@/components/Network';
import Swap from '@/components/Swap';

export default {
  components: {
    Spacer,
    Interact,
    Network,
    Swap
  }
};
</script>
