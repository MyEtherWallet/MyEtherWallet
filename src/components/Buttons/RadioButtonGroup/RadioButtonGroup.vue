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
    data: {
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
