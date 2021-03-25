<template>
  <!--
  =====================================================================================
    Aave Summary (includes currency and health factor)
  =====================================================================================
  -->
  <v-sheet
    class="pa-12 text-center"
    rounded
    color="white"
    elevation="1"
    :width="$vuetify.breakpoint.mdAndUp ? '650px' : '100%'"
  >
    <v-card
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
    }
  },
  computed: {
    details() {
      /* currently using dummy data for values */
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
    }
  },
  methods: {
    confirm() {
      this.$emit('confirmed');
    }
  }
};
</script>
