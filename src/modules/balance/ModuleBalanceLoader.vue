<template>
  <mew6-white-sheet class="pa-6">
    <div class="d-flex">
      <v-skeleton-loader type="avatar" />
      <v-skeleton-loader type="text" width="200px" />
    </div>
  </mew6-white-sheet>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.initChart();
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
