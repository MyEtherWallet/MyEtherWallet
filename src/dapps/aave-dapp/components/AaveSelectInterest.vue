<template>
  <!--
  =====================================================================================
    Aave Select Stable or Variable Interest
  =====================================================================================
  -->
  <div>
    <div class="text-left">
      Select the type of rate for your loan. Please click on the desired rate
      type and read the info box for more information.
    </div>
    <div class="d-flex justify-center align-center mt-12 mb-3">
      <!--
  =====================================================================================
    Stable Interest card
  =====================================================================================
  -->
      <v-card
        :disabled="rates.stable === '--'"
        :flat="isStable"
        :color="isStable ? 'greyLight' : 'white'"
        class="cursor-pointer d-flex flex-column py-6 px-8"
        @click.native="setType(interestTypes.stable)"
      >
        <v-icon x-large color="textMedium">mdi-arrow-right-circle</v-icon>
        <span class="textLight--text my-2">Stable</span>
        <span class="mew-heading-3 textMedium--text">{{ rates.stable }}</span>
      </v-card>
      <!--
  =====================================================================================
    Variable Interest card
  =====================================================================================
  -->
      <v-card
        :disabled="rates.variable === '--'"
        :flat="isVariable"
        :color="isVariable ? 'greyLight' : 'white'"
        class="cursor-pointer d-flex flex-column py-6 px-8 ml-5"
        @click.native="setType(interestTypes.variable)"
      >
        <!-- need to update this icon once we have it -->
        <v-icon x-large color="orangePrimary">mdi-arrow-right-circle</v-icon>
        <span class="textLight--text my-2">Variable</span>
        <span class="mew-heading-3 orangePrimary--text">{{
          rates.variable
        }}</span>
      </v-card>
    </div>
    <!--
  =====================================================================================
    Continue button
  =====================================================================================
  -->
    <div class="d-flex justify-center">
      <mew-button
        class="my-8"
        title="Continue"
        btn-size="xlarge"
        :disabled="!apr.type"
        @click.native="onContinue"
      />
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import { INTEREST_TYPES } from '../handlers/helpers';
import { formatPercentageValue } from '@/core/helpers/numberFormatHelper';

export default {
  props: {
    selectedToken: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      apr: {},
      interestTypes: INTEREST_TYPES
    };
  },
  computed: {
    rates() {
      const stable = this.selectedToken?.stableBorrowRateEnabled
        ? formatPercentageValue(
            new BigNumber(this.selectedToken.stableBorrowAPY).multipliedBy(100)
          ).value
        : '--';
      const variable =
        this.selectedToken?.variableBorrowAPY > 0
          ? formatPercentageValue(
              new BigNumber(this.selectedToken.variableBorrowAPY).multipliedBy(
                100
              )
            ).value
          : '--';
      return {
        stable,
        variable
      };
    },
    isStable() {
      return this.apr.type === INTEREST_TYPES.stable;
    },
    isVariable() {
      return this.apr.type === INTEREST_TYPES.variable;
    }
  },
  methods: {
    setType(type) {
      this.apr = {
        type: type,
        percentage:
          type === INTEREST_TYPES.stable
            ? this.rates.stable
            : this.rates.variable
      };
    },
    onContinue() {
      this.$emit('continue', this.apr);
    }
  }
};
</script>

<style lang="scss">
.aave-select-interest {
  .v-icon {
    font-size: 80px !important;
  }
}
</style>
