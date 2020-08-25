<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <NFTManagerContent />
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
import NFTManagerContent from './NFTManagerContent';
import Network from '@/web/components/Network';
import Swap from '@/web/components/Swap';

export default {
  components: {
    Spacer,
    NFTManagerContent,
    Network,
    Swap
  }
};
</script>
