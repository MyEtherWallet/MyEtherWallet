<template>
  <v-select
    v-model="selectedValue"
    :label="label"
    :placeholder="placeholder"
    outlined
    :clearable="false"
    :items="items"
    item-text="name"
    item-value="value"
  ></v-select>
</template>

<script>
export default {
  props: {
    label: { default: '', type: String },
    placeholder: { default: '', type: String },
    value: { default: '', type: String },
    items: {
      default: function () {
        return [];
      },
      type: Array
    }
  },
  data: () => ({
    selectedValue: ''
  }),
  watch: {
    selectedValue(val) {
      this.$emit('clicked', val);
    }
  }
};
</script>
