<template>
  <div class="balance-wrapper">
    <div
      :class="[
        'balance-container',
        title === balanceTitles.earnings
          ? 'earnings-container-height'
          : 'border-bottom'
      ]"
    >
      <div class="title-container">
        <p class="title">{{ title }}</p>
        <span v-if="title === balanceTitles.earnings" class="key-container">
          <div class="apr-circle"></div>
          <span>{{ $t('dappsAave.apr') }}</span>
          <div class="total-circle"></div>
          <span>{{ $t('dappsAave.total') }}</span>
        </span>
      </div>
      <i v-show="loadingHome" class="fa fa-spinner fa-spin" />
      <span v-if="title !== balanceTitles.earnings && !loadingHome">
        <p class="balance">${{ convertToFixed(balanceUsd) }}</p>
        <p class="eth-balance">
          {{ convertToFixed(balanceEth) }} {{ $t('common.currency.eth') }}
        </p>
      </span>
      <div v-if="title === balanceTitles.earnings" class="earnings-container">
        <p v-if="earningsBalance === 0" class="no-data">
          {{ $t('dappsAave.no-data') }}
        </p>
      </div>
    </div>
    <div
      v-if="title !== balanceTitles.earnings && !loadingHome"
      class="composition-container"
    >
      <div class="row">
        <span class="title">{{ $t('dappsAave.composition') }}</span>
        <div v-if="title !== balanceTitles.aggregatedBal">
          <!-- <span class="percentage">{{ compositionPercentage }}</span> -->
          <span v-if="title !== balanceTitles.collateral" class="available">{{
            $t('dappsAave.available')
          }}</span>
        </div>
        <div class="composition-wrap">
          <div
            v-for="(comp, idx) in composition"
            :key="idx"
            class="composition-percentage-hover"
            :style="{ width: comp.percentage + '%', background: comp.color }"
            :title="
              comp.symbol +
                ' ' +
                convertToFixed(comp.amount) +
                ' ' +
                comp.percentage +
                '%'
            "
          ></div>
          <!-- <div
            class="composition-full-bar"
            :style="{ background: compositionStyle }"
          ></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    balanceEth: {
      type: String,
      default: ''
    },
    balanceUsd: {
      type: String,
      default: ''
    },
    composition: {
      type: Array,
      default: () => {
        return [];
      }
    },
    earningsBalance: {
      type: Number,
      default: 0
    },
    loadingHome: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      compositionStyle: '',
      balanceTitles: {
        earnings: 'Earnings',
        collateral: 'Your Collateral',
        aggregatedBal: 'Aggregated Balance',
        borrowed: 'You Borrowed'
      }
    };
  },
  // watch: {
  //   composition() {
  //     if (this.title === this.balanceTitles.aggregatedBal) {
        
  //     }
  //   }
  // },
  methods: {
    convertToFixed(val) {
      if (!val) {
        return 0;
      }
      return val.slice(0, val.indexOf('.') + 5);
    }
    // getCompositionStyles() {
    //   this.compositionStyle = 'linear-gradient(to right,';

    //   this.composition.forEach((comp, idx) => {
    //     this.compositionStyle += ' ' + comp.color + ' ' + comp.percentage + '%';
    //     if (idx !== this.composition.length - 1) {
    //       this.compositionStyle += ',';
    //     }
    //   });

    //   this.compositionStyle += ')';
    // }
  }
};
</script>

<style lang="scss" scoped>
@import 'BalanceDisplay.scss';
</style>
