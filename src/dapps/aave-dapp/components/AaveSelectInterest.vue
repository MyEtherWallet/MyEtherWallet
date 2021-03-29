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
        :color="isStable ? 'boxShadow' : 'white'"
        class="cursor-pointer d-flex flex-column py-6 px-8"
        @click.native="setTypeToStable"
      >
        <v-icon color="secondary">mdi-arrow-right-circle</v-icon>
        <span class="textSecondary--text my-2">Stable</span>
        <span class="mew-heading-3 secondary--text">{{ rates.stable }}</span>
      </v-card>
      <!--
  =====================================================================================
    Variable Interest card
  =====================================================================================
  -->
      <v-card
        v-if="rates.variable !== '--'"
        :flat="isVariable"
        :color="isVariable ? 'boxShadow' : 'white'"
        class="cursor-pointer d-flex flex-column py-6 px-8 ml-5"
        @click.native="setTypeToVariable"
      >
        <!-- need to update this icon once we have it -->
        <v-icon x-large color="warning darken-1">mdi-arrow-right-circle</v-icon>
        <span class="textSecondary--text my-2">Variable</span>
        <span class="mew-heading-3 warning--text text--darken-1">{{
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
      class="mt-4"
      description="You cannot choose stable for reserves being
    used as collateral. Disable the collateral usage and try again."
    />
  </v-sheet>
</template>

<script>
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
    rates() {
      const stable = this.selectedToken?.stableApr;
      const variable = this.selectedToken?.variableApr;
      return {
        stable,
        variable
      };
    },
    isStable() {
      return this.type === 'Stable';
    },
    isVariable() {
      return this.type === 'Variable';
    }
  },
  methods: {
    setTypeToStable() {
      this.type = 'Stable';
    },
    setTypeToVariable() {
      this.type = 'Variable';
    },
    onContinue() {
      this.$emit('continue', this.type);
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
