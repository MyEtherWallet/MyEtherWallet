<template>
  <v-text-field
    v-model="textData"
    :label="label"
    :placeholder="placeholder"
    outlined
  ></v-text-field>
</template>

<script>
export default {
  props: {
    label: { default: '', type: String },
    placeholder: { default: '', type: String }
  },
  data: () => ({
    textData: ''
  }),
  watch: {
    textData(val) {
      this.$emit('changed', val);
    }
  }
};
</script>
