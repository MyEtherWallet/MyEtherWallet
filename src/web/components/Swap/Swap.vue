<template>
  <WhiteSheet sideinfo>
    <div class="px-7 pt-5">
      <BlockTitle :text="$t('common.swap')">
        <template v-slot:right-button>
          <TextButton>{{ $t('common.more') }}...</TextButton>
        </template>
      </BlockTitle>
    </div>
    <div class="pa-3">
      <v-sheet
        v-for="(data, key) in swapData"
        :key="key"
        color="bg_table"
        class="d-flex align-center justify-space-between border-radius--5px mt-1 py-3 px-4"
      >
        <div class="text-uppercase">
          {{ data.rate }} {{ data.currency }} / ETH
        </div>
        <div class="d-flex align-center">
          <img
            width="22"
            :src="
              require('@/assets/images/currencies/' + data.currency + '.png')
            "
            alt="currency-icon"
          />
          <img
            width="18"
            class="mx-2"
            src="@/assets/images/icons/icon-swap-arrow-grey.png"
            alt="swap-icon"
          />
          <img
            width="22"
            src="@/assets/images/currencies/eth.png"
            alt="eth-icon"
          />
        </div>
      </v-sheet>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import TextButton from '@/web/components/Buttons/TextButton1';
import BlockTitle from '@/web/components/BlockTitles/BlockTitle2';

export default {
  components: { WhiteSheet, TextButton, BlockTitle },
  data() {
    return {
      swapData: [
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        }
      ]
    };
  }
};
</script>
