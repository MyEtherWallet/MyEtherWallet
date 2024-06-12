<template>
  <v-row dense class="align-center justify-center">
    <!--
    =====================================================================================
      Back Button:
      desktop position in a row on the left
      mobile position after the next button
    =====================================================================================
    -->
    <v-col
      v-if="backBtnMethod"
      cols="12"
      sm="4"
      order="last"
      order-sm="first"
      class="px-sm-2"
    >
      <mew-button
        has-full-width
        :title="backBtnText"
        :disabled="backDisable"
        btn-style="outline"
        btn-size="xlarge"
        @click.native="backBtnMethod()"
      />
    </v-col>
    <!--
    =====================================================================================
      Next Button:
      desktop position in a row on the right
      mobile position before the back button
    =====================================================================================
    -->
    <v-col cols="12" :sm="backBtnMethod ? '4' : '12'" class="px-sm-2">
      <mew-button
        has-full-width
        btn-size="xlarge"
        :title="nextBtnText"
        :disabled="nextDisable"
        @click.native="nextBtnMethod()"
      />
    </v-col>
  </v-row>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
  backBtnText: { default: 'Back', type: String },
  backBtnMethod: {
    default: function () {
      return {};
    },
    type: Function
  },
  backDisable: { default: false, type: Boolean },
  nextBtnText: { default: 'Next', type: String },
  nextBtnMethod: {
    default: function () {
      return {};
    },
    type: Function
  },
  nextDisable: { default: false, type: Boolean }
});
</script>
