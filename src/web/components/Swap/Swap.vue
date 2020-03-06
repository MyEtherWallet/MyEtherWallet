<template>
  <WhiteSheet sideinfo>
    <div class="header-container pt-5 pb-3 px-7">
      <BlockTitle :text="$t('common.swap')">
        <template v-slot:right-button>
          <TextButton>{{ $t('common.more') }}...</TextButton>
        </template>
      </BlockTitle>
    </div>
    <div class="pb-1">
      <div v-for="(data, idx) in fakeData" :key="idx" class="mb-2 px-3">
        <SwapBlock
          :to="data.to"
          :from="data.from"
          :rate="data.rate"
          :amount="data.amount"
        />
      </div>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import SwapBlock from './components/SwapBlock';
import TextButton from '@/web/components/Buttons/TextButton1';
import BlockTitle from '@/web/components/BlockTitles/BlockTitle2';
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