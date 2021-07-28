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
        <div v-if="b.title === 'economy'" class="text-right">No tip</div>
        <div v-else class="text-right">
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

    <!--
    =====================================================================================
      Divider
    =====================================================================================
    -->
    <v-row v-if="!isSwap" align="center" class="pt-3 pb-9 px-3">
      <v-divider />
      <p class="mb-0 mx-4 basicOutlineActive--text font-weight-bold">OR</p>
      <v-divider />
    </v-row>
    <!--
      =====================================================================================
       Custom Gas
      =====================================================================================
      -->
    <div v-if="!isSwap" class="d-sm-flex text-center">
      <mew-input
        v-model="customGasPrice"
        label="Customize"
        placeholder=" "
        right-label="Gwei"
        class="mr-0 mr-sm-3"
      />
      <mew-button
        :title="customBtn.text"
        btn-size="xlarge"
        :btn-style="customBtn.style"
        :has-full-width="isSwap"
        @click.native="setCPrice"
      />
      <p v-if="isSwap" class="pt-2">
        To change the custom gas price, go to
        <span
          class="cursor--pointer go-to-global-text"
          @click="openGlobalSettings"
          >global settings</span
        >
      </p>
    </div>
    <v-row v-if="hasCustom" align="start" class="px-3">
      <mew-button
        :title="customBtn.text"
        btn-size="xlarge"
        :btn-style="customBtn.style"
        :has-full-width="true"
        @click.native="setCPrice"
      />
      <p class="pt-2">
        To change the custom gas price, go to
        <span
          class="cursor--pointer go-to-global-text"
          @click="openGlobalSettings"
          >global settings</span
        >
      </p>
    </v-row>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
import { mapState, mapGetters } from 'vuex';
import { fromWei } from 'web3-utils';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
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
    gasPrice: {
      type: String,
      default: '0'
    },
    setCustomGasPrice: {
      type: Function,
      default: () => {}
    },
    isSwap: {
      type: Boolean,
      default: false
    },
    openGlobalSettings: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      customGasPrice: '0'
    };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['swapLink']),
    ...mapState('global', ['gasPriceType']),
    customBtn() {
      if (!this.customGasPrice) return {};
      const usdValue = BigNumber(this.fiatValue).times(
        fromWei(this.customGasPrice, 'ether')
      );
      return {
        text: this.isSwap
          ? `Custom: ${this.customGasPrice} Gwei $ ${
              formatFiatValue(usdValue).value
            }`
          : 'Confirm',
        style: this.isSwap ? 'outline' : 'background'
      };
    },
    hasCustom() {
      return this.isSwap && this.gasPriceType === gasPriceTypes.STORED;
    }
  },
  mounted() {
    this.customGasPrice =
      this.gasPriceType === gasPriceTypes.STORED
        ? fromWei(this.gasPrice, 'gwei')
        : '0';
  },
  methods: {
    setCPrice() {
      this.setCustomGasPrice(this.customGasPrice);
    }
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
