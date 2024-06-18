<template>
  <!--
  =====================================================================================
    Mew Switch 
  =====================================================================================
  -->
  <div class="d-flex align-center">
    <span
      class="mew-body textPrimary--text mr-4 cursor-pointer"
      @click="switchToggle"
      >{{ label }}</span
    >
    <v-switch
      v-model="value"
      :ripple="false"
      color="white"
      class="mew-switch"
      inset
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

// emits
const emits = defineEmits(['switch']);

defineProps({
  /**
   * The switch label.
   */
  label: {
    type: String,
    default: ''
  }
});

// data
const value = ref(false);

// methods
const switchToggle = () => {
  value.value = !value.value;
  emits('switch', value.value);
};
</script>

<style lang="scss">
.mew-switch {
  input {
    pointer-events: all;
  }
  &.v-input--is-label-active {
    .v-input--switch__track {
      color: var(--v-primary-base) !important;
      caret-color: var(--v-primary-base) !important;
      opacity: 1;
    }
  }
}
</style>
