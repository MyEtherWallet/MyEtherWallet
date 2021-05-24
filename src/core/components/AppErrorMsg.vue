<template>
  <v-dialog> </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    close: {
      type: Function,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
