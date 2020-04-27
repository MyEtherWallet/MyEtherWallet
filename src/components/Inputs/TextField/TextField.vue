<template>
  <v-text-field
    outlined
    :label="label"
    :placeholder="placeholder"
    :value="value"
    @input="emitValue"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    label: { default: '', type: String },
    placeholder: { default: '', type: String },
    value: { default: '', type: String }
  },
  methods: {
    emitValue(e) {
      this.$emit('input', e);
    }
  }
};
</script>
