<template>
  <div class="side-info">
    <Network />
    <Spacer />
    <Swap />
    <Spacer />
    <MEWconnect />
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import Network from './Network';
import Swap from './Swap';
import MEWconnect from './MEWconnect';

export default {
  components: { Spacer, Network, Swap, MEWconnect }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';

.side-info {
  width: 300px;
}
</style>
