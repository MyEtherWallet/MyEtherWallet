<!--
  =====================================================================================
    Mew Text Area 
  =====================================================================================
  -->
<template>
  <v-textarea
    class="mew-text-area"
    outlined
    :rules="rules"
    :label="label"
    :value="inputValue"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// emits
const emits = defineEmits(['input']);

// props
const props = defineProps({
  /**
   * Text area label.
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Text area value.
   */
  value: {
    type: [String, Array],
    default: ''
  },
  /**
   * For validating your input - accepts an array of functions that take an input value as an argument and return either true / false or a string with an error message.
   */
  rules: {
    type: Array,
    default: () => []
  }
});

// data
const inputValue = ref(null);

// watch
watch(
  () => inputValue.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      emits('input', newVal);
    }
  }
);
watch(
  () => props.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      inputValue.value = newVal;
    }
  }
);

// mounted
onMounted(() => {
  inputValue.value = props.value;
});
</script>
