<template>
  <div>
    <div v-if="!isSwap" class="mb-6">
      Please select a default gas price for your transaction fee
    </div>

    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <div class="mr-2">0.0011 ETH</div>
        <div class="textSecondary--text">$3.45</div>
      </div>
      <div class="d-flex align-center">
        <v-icon small color="basic" class="mr-1">mdi-clock-outline</v-icon>
        <div>5 min</div>
      </div>
    </div>

    <div class="textBlack2--text mb-5">
      This fee is changed by Ethereum network. You can prioritize transaction by
      adding a tip to the miner.
    </div>

    <!--
    =====================================================================================
      Economic / Regular / Fast
    =====================================================================================
    -->
    <div>
      <div
        v-for="(b, key) in buttons"
        :key="key"
        class="
          px-5
          py-4
          mb-2
          d-flex
          align-center
          justify-space-between
          group-button
        "
        :class="[selected === b.title ? 'active' : '']"
        @click.stop="
          () => {
            setSelected(b.title);
          }
        "
      >
        <div class="d-flex align-center">
          <div class="mr-2 ml-n1 text-center" style="width: 40px">
            <v-icon v-if="b.title === 'economy'">mdi-check</v-icon>
            <v-icon v-if="b.title === 'regular'">mdi-arrow-up</v-icon>
            <v-icon v-if="b.title === 'fast'">mdi-arrow-up</v-icon>
            <v-icon v-if="b.title === 'fast'" class="ml-n2"
              >mdi-arrow-up</v-icon
            >
          </div>
          <div v-if="b.title === 'economy'">Normal priority</div>
          <div v-if="b.title === 'regular'">Higher priority</div>
          <div v-if="b.title === 'fast'">Highest priority</div>
        </div>
        <div class="text-right">
          <div class="mew-label">+{{ b.usd }} {{ b.time }}</div>
          <div class="mew-label">+{{ b.gas | twoDecimalPoint }} Gwei</div>
        </div>
      </div>
    </div>

    <div class="text-center mew-label mt-6 mb-5 secondary--text">
      To increase priority
      <a
        rel="noopener noreferrer"
        target="_blank"
        :href="swapLink"
        class="font-weight-medium"
      >
        Buy more ETH
      </a>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'SettingsGasPrice',
  filters: {
    twoDecimalPoint: function (value) {
      if (value.includes('.')) return BigNumber(value).toFixed(2);
      return value;
    }
  },
  props: {
    selected: {
      type: String,
      default: gasPriceTypes.ECONOMY
    },
    setSelected: {
      type: Function,
      default: () => {}
    },
    buttons: {
      type: Array,
      default: () => []
    },
    isSwap: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['swapLink']),
    ...mapState('global', ['gasPriceType'])
  }
};
</script>

<style lang="scss" scoped>
.group-button {
  padding: 10px;
  border-radius: 10px;
  background-color: #d0f4f8;
  opacity: 0.5;
  cursor: pointer;
  user-select: none;
  width: 100%;
  border: 1px solid transparent;
  &.active {
    border: 1px solid var(--v-primary-base);
    background-color: #f2fafa;
    opacity: 1;
  }
}
.go-to-global-text {
  color: var(--v-primary-base);
}
</style>
