<template>
  <v-select
    :label="label"
    :placeholder="placeholder"
    outlined
    :clearable="false"
    :items="items"
    item-text="name"
    item-value="value"
    append-icon="mdi-chevron-down"
    @input="emitValue"
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
  methods: {
    emitValue(e) {
      this.$emit('input', e);
    }
  }
};
</script>
