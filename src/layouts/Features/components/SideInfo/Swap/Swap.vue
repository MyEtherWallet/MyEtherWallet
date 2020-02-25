<template>
  <WhiteSheet sideinfo class="pb-7">
    <div class="header-container pt-7 pl-7 pr-7 mb-3">
      <h4 class="text-color--dark-space bold">{{ $t('common.swap') }}</h4>
      <StdButton
        :button-class="'button--text-green'"
        :size="'small'"
        :min-width="false"
        >{{ $t('common.more') }}...</StdButton
      >
    </div>
    <div v-for="(data, idx) in fakeData" :key="idx" class="mt-2 pl-3 pr-3">
      <SwapBlock
        :to="data.to"
        :from="data.from"
        :rate="data.rate"
        :amount="data.amount"
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
          amount: '20',
          from: 'eth',
          rate: '0.002',
          to: 'btc'
        },
        {
          amount: '20',
          from: 'eth',
          rate: '0.002',
          to: 'btc'
        },
        {
          amount: '20',
          from: 'eth',
          rate: '0.002',
          to: 'btc'
        },
        {
          amount: '20',
          from: 'eth',
          rate: '0.002',
          to: 'btc'
        },
        {
          amount: '20',
          from: 'eth',
          rate: '0.002',
          to: 'btc'
        },
        {
          amount: '20',
          from: 'eth',
          rate: '0.002',
          to: 'btc'
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
