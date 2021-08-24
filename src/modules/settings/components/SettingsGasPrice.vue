<template>
  <div>
    <div v-if="!isSwap" class="mb-6">
      Please select a default gas price for your transaction fee
    </div>

    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <div class="mr-2">{{ currentValue.gas | twoDecimalPoint }} Gwei</div>
        <div class="textSecondary--text">{{ currentValue.usd }}</div>
      </div>
      <div class="d-flex align-center">
        <v-icon small color="basic" class="mr-1">mdi-clock-outline</v-icon>
        <div>{{ timeWillTake }}</div>
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
            <v-icon v-if="b.title === gasPriceTypes.ECONOMY" color="textBlack">
              mdi-check
            </v-icon>
            <v-icon v-if="b.title === gasPriceTypes.REGULAR" color="textBlack">
              mdi-arrow-up
            </v-icon>
            <v-icon v-if="b.title === gasPriceTypes.FAST" color="textBlack">
              mdi-arrow-up
            </v-icon>
            <v-icon
              v-if="b.title === gasPriceTypes.FAST"
              color="textBlack"
              class="ml-n2"
            >
              mdi-arrow-up
            </v-icon>
          </div>
          <div v-if="b.title === gasPriceTypes.ECONOMY" color="textBlack">
            Normal priority
          </div>
          <div v-if="b.title === gasPriceTypes.REGULAR" color="textBlack">
            Higher priority
          </div>
          <div v-if="b.title === gasPriceTypes.FAST" color="textBlack">
            Highest priority
          </div>
        </div>
        <div class="text-right">
          <div
            v-if="b.title === gasPriceTypes.ECONOMY"
            class="mew-label textSecondary--text"
          >
            No tip
          </div>
          <div v-else>
            <div class="mew-label textSecondary--text">
              +{{ b.usd }} {{ b.time }}
            </div>
            <div class="mew-label textSecondary--text">
              +{{ b.gas | twoDecimalPoint }} Gwei
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!hasMinEth && !globalSetting" class="mt-6 mb-5 secondary--text">
      <div>Not enough funds to increase priority.</div>
      <a
        rel="noopener noreferrer"
        target="_blank"
        :href="swapLink"
        class="mt-1 d-block"
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
import { estimatedTime } from '@/core/helpers/gasPriceHelper';

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
    },
    hasMinEth: {
      type: Boolean,
      default: false
    },
    globalSetting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gasPriceTypes: gasPriceTypes
    };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['swapLink']),
    ...mapState('global', ['gasPriceType', 'gasPrice']),
    currentValue() {
      for (const but of this.buttons) {
        if (but.title === this.selected) {
          return but;
        }
      }
      return {};
    },
    timeWillTake() {
      return estimatedTime(this.selected);
    }
  }
};
</script>

<style lang="scss" scoped>
.group-button {
  padding: 10px;
  border-radius: 10px;
  background-color: #f4f6f8;
  //opacity: 0.5;
  cursor: pointer;
  user-select: none;
  width: 100%;
  border: 2px solid transparent;
  &:hover {
    background-color: #e9eff4;
  }
  &.active {
    border: 2px solid #31c0a5;
    background-color: #e1f7f4;
    opacity: 1;
    &:hover {
      opacity: 1;
      background-color: #d5edef;
    }
  }
}
.go-to-global-text {
  color: var(--v-primary-base);
}
</style>
