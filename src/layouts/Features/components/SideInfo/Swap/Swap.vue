<template>
  <WhiteSheet sideinfo class="pa-7">
    <div class="header-container">
      <h4 class="text-color--dark-space bold">{{ $t('common.swap') }}</h4>
      <StdButton
        :button-class="'button--text-green'"
        :size="small"
        :min-width="false"
        >{{ $t('common.more') }}...</StdButton
      >
    </div>
    <div v-for="(data, idx) in fakeData" :key="idx">
      <SwapBlock
        :to="data.to"
        :from="data.from"
        rate="data.rate"
        amount="data.amount"
      />
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import StdButton from '@/components/StdButton';
import SwapBlock from './components/SwapBlock';

export default {
  components: { WhiteSheet, StdButton, SwapBlock },
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
    };
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
}
</style>
