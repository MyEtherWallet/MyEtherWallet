<template>
  <WhiteSheet sideinfo class="pb-7">
    <div class="header-container pt-7 pl-7 pr-7 mb-3">
      <BlockTitle :text="$t('common.swap')">
        <template v-slot:right-button>
          <TextButton>{{ $t('common.more') }}...</TextButton>
        </template>
      </BlockTitle>
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
import SwapBlock from './components/SwapBlock';
import TextButton from '@/components/Buttons/TextButton1';
import BlockTitle from '@/components/BlockTitles/BlockTitle2';

export default {
  components: { WhiteSheet, TextButton, SwapBlock, BlockTitle },
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
