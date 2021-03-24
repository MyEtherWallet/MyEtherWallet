<template>
  <!--
  =====================================================================================
    Aave Summary (includes currency and health factor)
    used for deposit, borrow and interest details
  =====================================================================================
  -->
  <v-sheet
    class="pa-12 text-center"
    rounded
    color="white"
    elevation="1"
    :width="$vuetify.breakpoint.mdAndUp ? '650px' : '100%'"
  >
    <!--
  =====================================================================================
    Deposit/Borrow currency details card
  =====================================================================================
  -->
    <v-card
      v-if="!onSelectInterest"
      class="d-flex align-center justify-space-between pa-7"
      flat
      color="overlayBg"
    >
      <div class="d-flex flex-column align-start">
        <span class="mew-heading-3 textPrimaryModule--text mb-2"
          >Amount to Deposit</span
        >
        <!-- dummy data -->
        <span class="mew-heading-1 mb-2">12.256 {{ selectedToken.token }}</span>
        <span class="textPrimaryModule--text">$13.64</span>
      </div>
      <img
        height="80"
        :src="selectedToken.tokenImg"
        :alt="selectedToken.token"
      />
    </v-card>
    <!--
  =====================================================================================
    Select interest details card
  =====================================================================================
  -->
    <div class="d-flex align-center justify-space-between mb-10">
      <v-card flat class="d-flex flex-column pa-10 text-left" color="overlayBg">
        <span class="font-weight-bold">Current Interest Type</span>
        <span
          :class="[
            'mew-heading-2 my-3',
            getInterestTypeClass(currentInterest.type)
          ]"
          >{{ currentInterest.percentage }}</span
        >
        <span
          :class="[
            'font-weight-bold',
            getInterestTypeClass(currentInterest.type)
          ]"
          >{{ currentInterest.type }}</span
        >
      </v-card>
      <v-icon>mdi-arrow-right</v-icon>
      <v-card flat class="d-flex flex-column pa-10 text-left" color="overlayBg">
        <span class="font-weight-bold">Next Interest Type</span>
        <span
          :class="[
            'mew-heading-2 my-3',
            getInterestTypeClass(nextInterest.type)
          ]"
          >{{ nextInterest.percentage }}</span
        >
        <span
          :class="['font-weight-bold', getInterestTypeClass(nextInterest.type)]"
          >{{ nextInterest.type }}</span
        >
      </v-card>
    </div>
    <v-divider v-if="onSelectInterest" />
    <!--
  =====================================================================================
    Other details (currency, health factor)
  =====================================================================================
  -->
    <v-row
      v-for="(detail, idx) in details"
      :key="idx"
      class="d-flex align-center mt-5"
    >
      <v-col class="d-flex align-center" cols="6"
        ><span>{{ detail.title }}</span>
        <mew-tooltip v-if="detail.tooltip" class="ml-1" :text="detail.tooltip"
      /></v-col>
      <v-col class="font-weight-bold d-flex align-center justify-end" cols="6">
        <img v-if="detail.icon" :src="detail.icon" height="20" class="mr-1" />
        <v-icon v-if="detail.indicator" :class="detail.class">{{
          detail.indicator
        }}</v-icon>
        <span :class="detail.class">{{ detail.value }}</span>
      </v-col>
    </v-row>
    <v-divider v-if="onSelectInterest" class="mt-5" />
    <!--
  =====================================================================================
   Confirm button
  =====================================================================================
  -->
    <mew-button
      class="mt-10"
      title="Confirm"
      btn-size="xlarge"
      @click.native="confirm"
    />
  </v-sheet>
</template>

<script>
import { convertToFixed } from '../handlers/helpers';

const types = {
  stable: 'stable',
  variable: 'variable'
};

export default {
  props: {
    handler: {
      type: [Object, null],
      validator: item => typeof item === 'object' || null,
      default: () => {}
    },
    selectedToken: {
      type: Object,
      default: () => {}
    },
    onSelectInterest: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    details() {
      /* currently using dummy data for values */
      return !this.onSelectInterest
        ? this.depositDetails
        : [
            {
              title: 'Currency',
              value: this.selectedToken.token,
              icon: this.selectedToken.tokenImg
            }
          ];
    },
    depositDetails() {
      return [
        {
          title: 'Current Health Factor',
          tooltip: 'Tooltip text',
          value: this.currentHealthFactor,
          class:
            this.currentHealthFactor > this.nextHealthFactor
              ? 'primary--text'
              : 'error-text'
        },
        {
          title: 'Next Health Factor',
          tooltip: 'Tooltip text',
          value: '2.1725',
          class:
            this.currentHealthFactor > this.nextHealthFactor
              ? 'error--text'
              : 'primary--text',
          indicator:
            this.currentHealthFactor > this.nextHealthFactor
              ? 'mdi-arrow-down'
              : 'mdi-arrow-up'
        }
      ];
    },
    currentHealthFactor() {
      return this.handler?.userSummary?.healthFactor;
    },
    nextHealthFactor() {
      return convertToFixed(this.currentHealthFactor);
    },
    /* currently using dummy data for values */
    currentInterest() {
      return {
        type: 'Variable',
        percentage: '11.33%'
      };
    },
    nextInterest() {
      return {
        type: 'Stable',
        percentage: '2.837%'
      };
    }
  },
  methods: {
    confirm() {
      this.$emit('confirmed');
    },
    getInterestTypeClass(type) {
      if (type.toLowerCase() === types.stable) {
        return 'secondary--text';
      }
      return 'warning--text text--darken-1';
    }
  }
};
</script>
