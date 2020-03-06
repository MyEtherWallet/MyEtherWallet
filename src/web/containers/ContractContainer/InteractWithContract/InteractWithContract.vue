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
import Spacer from '@/web/components/Common/Spacer';
import Interact from './Interact';

import Network from '@/web/components/Network';
import Swap from '@/web/components/Swap';

export default {
  components: {
    Spacer,
    Interact,
    Network,
    Swap
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
