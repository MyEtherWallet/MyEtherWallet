<template>
  <div>
    <div class="textPrimary--text mb-5">
      This fee is charged by the Ethereum network and fluctuates depending on
      network traffic. MEW does not profit from this fee.
    </div>

    <!--
    =====================================================================================
      Economic / Regular / Fast
    =====================================================================================
    -->
    <div>
      <div
        v-for="(b, key) in buttons"
        :id="[unavailableSpeeds[b.title] ? 'disabled' : '']"
        :key="key"
        class="mb-2 d-flex align-center justify-space-between group-button"
        :class="[selected === b.title ? 'active' : '']"
        @click.stop="
          () => {
            setSelected(b.title);
          }
        "
      >
        <div class="d-flex align-center">
          <div
            class="mr-1 ml-n1 text-center"
            style="width: 40px; line-height: 0"
          >
            <v-icon v-if="b.title === gasPriceTypes.ECONOMY" color="textBlack">
              mdi-check
            </v-icon>
            <img
              v-if="b.title === gasPriceTypes.REGULAR"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
            <img
              v-if="b.title === gasPriceTypes.FAST"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
            <img
              v-if="b.title === gasPriceTypes.FAST"
              src="@/assets/images/icons/icon-arrow-up.svg"
              alt="arrow up"
              height="15"
            />
          </div>
          <div>
            <div class="mew-heading-3 font-weight-regular">
              {{ b.priority }}
            </div>
            <div v-if="!fromSettings" class="prices d-flex">
              <div
                v-if="b.title === gasPriceTypes.ECONOMY"
                class="secondary--text mr-2"
              >
                {{ economyInEth }} {{ currencyName }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.REGULAR"
                class="secondary--text mr-2"
              >
                {{ regularInEth }} {{ currencyName }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.FAST"
                class="secondary--text mr-2"
              >
                {{ fastInEth }} {{ currencyName }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.ECONOMY"
                class="textSecondary--text"
              >
                ${{ economyInUsd }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.REGULAR"
                class="textSecondary--text"
              >
                ${{ regularInUsd }}
              </div>
              <div
                v-if="b.title === gasPriceTypes.FAST"
                class="textSecondary--text"
              >
                ${{ fastInUsd }}
              </div>
            </div>
          </div>
        </div>

        <!-- Show Priority Time-->
        <div class="d-flex align-center">
          <v-icon class="mr-1" color="primary" small>mdi-clock-outline</v-icon>
          <div class="primary--text">{{ b.time }}</div>
        </div>
      </div>
    </div>
    <div class="mt-4 d-flex flex-column align-center">
      <div v-if="!fromSettings && showNotEnoughEthWarning" class="mt-3">
        <span class="secondary--text">Can't increase priority? </span>
        <a target="_blank" :href="swapLink"> Buy more ETH </a>
      </div>
    </div>
  </div>
</template>

<script>
import { toBN, fromWei } from 'web3-utils';
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
import { mapState, mapGetters } from 'vuex';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';

export default {
  name: 'SettingsGasPrice',
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
    notEnoughEth: {
      type: Boolean,
      default: false
    },
    totalGasLimit: {
      type: String,
      default: '0'
    },
    fromSettings: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gasPriceTypes: gasPriceTypes,
      previousSelected: null,
      showNotEnoughEthWarning: false,
      unavailableSpeeds: {
        economy: false,
        regular: false,
        fast: false
      }
    };
  },
  computed: {
    ...mapGetters('external', ['fiatValue']),
    ...mapGetters('global', ['swapLink', 'gasPriceByType', 'network']),
    ...mapState('global', ['gasPriceType', 'gasPrice']),
    ...mapGetters('wallet', ['balanceInETH']),
    currencyName() {
      return this.network.type.currencyName;
    },
    economyInEth() {
      const txFee = this.calcTxFee(gasPriceTypes.ECONOMY);
      return this.formatInEth(txFee);
    },
    regularInEth() {
      const txFee = this.calcTxFee(gasPriceTypes.REGULAR);
      return this.formatInEth(txFee);
    },
    fastInEth() {
      const txFee = this.calcTxFee(gasPriceTypes.FAST);
      return this.formatInEth(txFee);
    },
    economyInUsd() {
      const txFee = this.calcTxFee(gasPriceTypes.ECONOMY);
      return this.formatInUsd(txFee);
    },
    regularInUsd() {
      const txFee = this.calcTxFee(gasPriceTypes.REGULAR);
      return this.formatInUsd(txFee);
    },
    fastInUsd() {
      const txFee = this.calcTxFee(gasPriceTypes.FAST);
      return this.formatInUsd(txFee);
    }
  },
  watch: {
    /**
     * If not enough balance to cover new priority, go back to previous priority
     */
    selected() {
      if (this.notEnoughEth) {
        if (this.selected == 'regular') {
          this.unavailableSpeeds.regular = true;
          this.unavailableSpeeds.fast = true;
        } else if (this.selected == 'fast') {
          this.unavailableSpeeds.fast = true;
        } else {
          this.unavailableSpeeds.economy = true;
          this.unavailableSpeeds.regular = true;
          this.unavailableSpeeds.fast = true;
        }
        this.setSelected(this.previousSelected);
        this.showNotEnoughEthWarning = true;
      }

      if (!this.notEnoughEth) {
        this.previousSelected = this.selected;
      }
    },
    notEnoughEth(val) {
      this.unavailableSpeeds.economy = val;
      this.unavailableSpeeds.regular = val;
      this.unavailableSpeeds.fast = val;
    }
  },
  mounted() {
    this.previousSelected = this.selected;

    if (this.notEnoughEth) {
      this.showNotEnoughEthWarning = true;
      this.unavailableSpeeds.economy = true;
      this.unavailableSpeeds.regular = true;
      this.unavailableSpeeds.fast = true;
    }
  },
  methods: {
    calcTxFee(priority) {
      return fromWei(
        toBN(this.totalGasLimit).mul(toBN(this.gasPriceByType(priority)))
      ).toString();
    },
    formatInEth(fee) {
      return formatFloatingPointValue(fee).value;
    },
    formatInUsd(fee) {
      return formatFiatValue(BigNumber(fee).times(this.fiatValue).toFixed(2))
        .value;
    }
  }
};
</script>

<style lang="scss" scoped>
.group-button {
  min-height: 72px;
  padding: 5px 16px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  border: 1px solid #eaedf7;
  &#disabled {
    filter: grayscale(1);
    opacity: 0.25 !important;
    pointer-events: none;
    border: 1px solid #eaedf7;
  }
  &:hover {
    background-color: #e9eff4;
  }
  &.active {
    border: 2px solid #05c0a5;
    opacity: 1;
    &:hover {
      opacity: 1;
      background-color: #d5edef;
    }
  }
}
.buy-eth:hover {
  cursor: pointer;
}
.prices {
  white-space: nowrap;
  font-size: 14px;
}
</style>
