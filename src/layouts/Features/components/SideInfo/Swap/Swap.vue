<template>
  <WhiteSheet sideinfo class="pa-7">
    <div class="header-container">
      <h4 class="text-color--dark-space bold">{{ $t('common.swap') }}</h4>
      <StdButton>{{ $t('common.more') }}...</StdButton>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import StdButton from '@/components/StdButton';

export default {
  components: { WhiteSheet, StdButton },
  data() {
    return {
      fakeData: [
        {
          amt: '20',
          from: 'ETH',
          rate: '0.002',
          to: 'BTC'
        }
      ]
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
