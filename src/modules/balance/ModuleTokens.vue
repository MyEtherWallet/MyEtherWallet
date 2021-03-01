<template>
  <div>
    <mew-module
      v-if="tokensData.length > 0"
      class="mt-6"
      subtitle="My Tokens Value"
      :title="`$ ${totalTokensValue}`"
      :icon="require('@/assets/images/icons/icon-token-grey.png')"
      icon-align="left"
    >
      <template #moduleBody>
        <mew-table
          :has-color="false"
          :table-headers="tableHeaders"
          :table-data="tokensData"
        />
      </template>
    </mew-module>
    <v-sheet v-else class="token-empty-list mt-6 pa-12" color="white">
      <h2 class="mb-6">My token list is empty</h2>
      <mew-button
        class="ml-auto ml-n3"
        :has-full-width="false"
        :title="'+ ' + 'Buy ERC20 tokens'"
        btn-size="xsmall"
        btn-style="transparent"
        @click.native="navigateToSwap"
      />
    </v-sheet>
  </div>
</template>
<script>
import BigNumber from 'bignumber.js';

export default {
  props: {
    ownersTokens: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      tableHeaders: [
        {
          text: 'Token',
          value: 'token',
          sortable: true
        },
        {
          text: 'Price',
          value: 'price',
          sortable: true
        },
        {
          text: 'Market Cap',
          value: 'cap',
          sortable: true
        },
        {
          text: '24H Changes',
          value: 'change',
          sortable: true
        },
        {
          text: 'Token Value',
          value: 'value',
          sortable: true,
          width: '250px'
        }
      ]
    };
  },
  computed: {
    tokensData() {
      return this.ownersTokens
        .filter(item => {
          if (item.price_change_24h || item.market_cap) {
            return item;
          }
        })
        .map(item => {
          const newObj = {};
          newObj.value = `$ ${item.usdBalance}`;
          newObj.token = item.symbol;
          newObj.cap = item.market_cap;
          newObj.change = item.price_change_24h;
          newObj.status = item.price_change_24h > 0 ? '+' : '-';
          newObj.price = item.price;
          newObj.tokenImg = item.img;
          newObj.usdBalance = item.usdBalance;

          return newObj;
        });
    },
    totalTokensValue() {
      return new BigNumber(
        this.tokensData.reduce((acc, currentVal) => {
          return new BigNumber(acc).plus(currentVal.usdBalance).toFixed();
        }, 0)
      ).toFixed(2);
    }
  },
  methods: {
    navigateToSwap() {
      this.$router.push({ name: 'Swap' });
    }
  }
};
</script>
<style lang="scss" scoped>
.token-empty-list {
  background-image: url(~@/assets/images/backgrounds/bg-half-circle.png),
    url(~@/assets/images/backgrounds/bg-small-half-circle.png);
  background-position: right -16px bottom -26px, left -18px bottom -29px;
  background-size: 357px, 150px;
  border-radius: 12px;
}
.mew-component--my-token-value {
  .theme--dark.v-sheet {
    background-color: var(--v-mewBg-base);
    border-color: var(--v-mewBg-base);
  }
  .block-title {
    margin-left: 10px;
    .header-wrapper {
      padding: 0 !important;
    }
    .left-wrapper {
      padding-left: 0 !important;
    }
    .right-wrapper {
      padding: 0 !important;
      margin-right: 10px;
    }
  }
}
</style>
