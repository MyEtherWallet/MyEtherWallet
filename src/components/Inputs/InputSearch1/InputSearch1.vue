<template>
  <v-autocomplete
    v-model="input1"
    :label="title"
    :placeholder="placeholder"
    outlined
    color="teal accent-4"
    :clearable="false"
    :items="items"
    item-text="name"
    item-value="value"
  >
    <template v-slot:item="data">
      <template>
        <v-list-item-content class="pa-0">
          <v-list-item-title>{{ data.item.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ data.item.group }}</v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    title: { default: '', type: String },
    placeholder: { default: '', type: String },
    value: { default: '', type: String },
    items: {
      default: function() {
        return [];
      },
      type: Array
    }
  },
  data: () => ({
    input1: ''
  }),
  watch: {
    input1(newValue) {
      this.$emit('input', newValue);
    }
  },
  mounted() {
    this.input1 = this.value;
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
