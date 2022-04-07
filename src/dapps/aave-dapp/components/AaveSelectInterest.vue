<template>
  <!--
  =====================================================================================
    Aave Select Stable or Variable Interest
  =====================================================================================
  -->
  <v-sheet
    class="pa-12 text-center aave-select-interest"
    rounded
    color="white"
    elevation="1"
    :width="$vuetify.breakpoint.mdAndUp ? '650px' : '100%'"
  >
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
        v-if="rates.stable !== '--'"
        :flat="isStable"
        :color="isStable ? 'greyLight' : 'white'"
        class="cursor-pointer d-flex flex-column py-6 px-8"
        @click.native="setTypeToStable"
      >
        <v-icon color="textMedium">mdi-arrow-right-circle</v-icon>
        <span class="textLight--text my-2">Stable</span>
        <span class="mew-heading-3 textMedium--text">{{ rates.stable }}</span>
      </v-card>
      <!--
  =====================================================================================
    Variable Interest card
  =====================================================================================
  -->
      <v-card
        v-if="rates.variable !== '--'"
        :flat="isVariable"
        :color="isVariable ? 'greyLight' : 'white'"
        class="cursor-pointer d-flex flex-column py-6 px-8 ml-5"
        @click.native="setTypeToVariable"
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
    <mew-button
      class="my-8"
      title="Continue"
      btn-size="xlarge"
      :disabled="type === ''"
      @click.native="onContinue"
    />
    <mew-warning-sheet
      v-if="showError"
      class="mt-4"
      description="You cannot choose stable for reserves being
    used as collateral. Disable the collateral usage and try again."
    />
  </v-sheet>
</template>

<script>
import { INTEREST_TYPES, roundPercentage } from '../handlers/helpers';
import BigNumber from 'bignumber.js';
export default {
  props: {
    selectedToken: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      type: ''
    };
  },
  computed: {
    showError() {
      return this.selectedToken?.usageAsCollateralEnabled || false;
    },
    rates() {
      const stable = this.selectedToken?.stableBorrowRateEnabled
        ? roundPercentage(
            new BigNumber(this.selectedToken.stableBorrowRate)
              .multipliedBy(100)
              .toString()
          )
        : '--';
      const variable = this.selectedToken
        ? roundPercentage(
            new BigNumber(this.selectedToken.variableBorrowRate)
              .multipliedBy(100)
              .toString()
          )
        : '--';
      return {
        stable,
        variable
      };
    },
    isStable() {
      return this.type === INTEREST_TYPES.stable;
    },
    isVariable() {
      return this.type === INTEREST_TYPES.variable;
    }
  },
  methods: {
    setTypeToStable() {
      this.type = INTEREST_TYPES.stable;
    },
    setTypeToVariable() {
      this.type = INTEREST_TYPES.variable;
    },
    onContinue() {
      const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      this.$emit('continue', type);
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
