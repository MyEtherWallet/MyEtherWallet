<template>
  <v-tooltip top color="white">
    <template v-slot:activator="{ on }">
      <div v-on="on"><slot /></div>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
