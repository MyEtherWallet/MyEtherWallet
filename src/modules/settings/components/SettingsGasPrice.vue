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
            class="text-center group-button pb-5 pt-2"
            :class="selected === b.title ? 'active' : ''"
            @click="setSelected(b.title)"
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
      <v-row align="center" class="pt-3 pb-9 px-3" v-if="!isSwap">
        <v-divider />
        <p class="mb-0 mx-4 basicOutlineActive--text font-weight-bold">OR</p>
        <v-divider />
      </v-row>
      <!--
      =====================================================================================
       Custom Gas
      =====================================================================================
      -->
      <v-row align="start" class="px-3">
        <mew-input
          v-if="!isSwap"
          v-model="customGasPrice"
          label="Customize"
          placeholder=" "
          right-label="Gwei"
          class="mr-3"
        />
        <mew-button
          :title="customBtn.text"
          btn-size="xlarge"
          :btn-style="customBtn.style"
          :has-full-width="isSwap"
          @click.native="setCustomGasPrice(customGasPrice)"
        />
        <p v-if="isSwap" class="pt-2">
          To change the custom gas price, go to
          <span
            @click="openGlobalSettings"
            class="cursor--pointer go-to-global-text"
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
import { mapState } from 'vuex';
import { fromWei } from 'web3-utils';

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
      customGasPrice:
        this.selected === gasPriceTypes.STORED ? this.gasPrice : '0'
    };
  },
  computed: {
    ...mapState('external', ['ETHUSDValue']),
    customBtn() {
      const usdValue = BigNumber(this.ETHUSDValue.value).times(
        fromWei(this.customGasPrice, 'ether')
      );
      return {
        text: this.isSwap
          ? `Custom: ${fromWei(this.customGasPrice, 'gwei')} Gwei ${usdValue}`
          : 'Confirm',
        style: this.isSwap ? 'outline' : 'background'
      };
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
