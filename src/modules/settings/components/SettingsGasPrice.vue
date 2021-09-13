<template>
  <div class="pa-6">
    <div v-if="!isSwap" class="mb-6">
      Please select a default gas price for your transaction fee
    </div>
    <!--
    =====================================================================================
      Economic / Regular / Fast
    =====================================================================================
    -->
    <v-sheet color="transparent" max-width="500px" class="mx-auto">
      <v-row>
        <v-col v-for="(b, key) in buttons" :key="key" cols="12" sm="4">
          <div
            :class="[
              selected === b.title ? 'active' : '',
              'text-center group-button pb-5 pt-2'
            ]"
            @click.stop="
              () => {
                setSelected(b.title);
              }
            "
          >
            <mew-icon :icon-name="b.icon" :img-height="80" />
            <h5 class="font-weight-bold mb-2 text-capitalize">{{ b.title }}</h5>
            <div class="font-weight-bold mb-2">
              ~ {{ b.gas | twoDecimalPoint }} Gwei
            </div>
            <div>{{ b.usd }} {{ b.time }}</div>
          </div>
        </v-col>
      </v-row>
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
          type="number"
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
    </v-sheet>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { gasPriceTypes } from '@/core/helpers/gasPriceHelper';
import { mapState, mapGetters } from 'vuex';
import { fromWei, toWei } from 'web3-utils';
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
    ...mapState('global', ['gasPriceType']),
    customBtn() {
      const defaultGasPrice = !this.customGasPrice ? '0' : this.customGasPrice;
      const usdValue = BigNumber(this.fiatValue).times(
        fromWei(toWei(defaultGasPrice, 'gwei'), 'ether')
      );
      return {
        text: this.isSwap
          ? `Custom: ${defaultGasPrice} Gwei $ ${
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
