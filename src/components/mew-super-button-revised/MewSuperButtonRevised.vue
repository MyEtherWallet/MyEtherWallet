<!--
  =====================================================================================
    Mew Super Button Revised - will later be added to mew components
  =====================================================================================
  -->
<template>
  <v-btn
    class="titlePrimary--text full-width mew-super-button-revised"
    color="white basic-border"
    :ripple="false"
    depressed
  >
    <v-row no-gutters class="pl-5 full-width align-center">
      <v-col cols="2">
        <img height="40px" :src="leftIcon" alt="left icon" />
      </v-col>
      <v-col class="text-left pl-4" cols="10">
        <span class="mew-heading-3">{{ title }}</span>
      </v-col>
    </v-row>
  </v-btn>
</template>

<script>
export default {
  name: 'MewSuperButtonRevised',
  props: {
    /**
     * The text that will go in the button.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * The left icon url. Inserts an icon on the left of the button title.
     */
    leftIcon: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
.v-application {
  .v-btn.mew-super-button-revised {
    border-radius: 8px;
    height: 100% !important;
    text-transform: none;
    &.basic-border {
      border: 1px solid rgb(109, 137, 166, 0.24) !important;
    }
  }
}
</style>
