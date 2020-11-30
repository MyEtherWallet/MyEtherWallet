<template>
  <v-btn
    text
    rounded
    small
    dark
    class="mew-component--text-btn d-flex align-center text-transform--initial"
    @click="$emit('on')"
  >
    <v-icon v-if="minus" color="primary">mdi-minus-circle</v-icon>
    <v-icon v-if="plus" small color="primary">mdi-plus-circle</v-icon>
    <div class="ml-1 nowrap primary--text">{{ label }}</div>
  </v-btn>
</template>

<script>
export default {
  props: {
    label: {
      default: 'Add',
      type: String
    },
    minWidth: {
      default: '',
      type: String
    },
    plus: {
      default: false,
      type: Boolean
    },
    minus: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
