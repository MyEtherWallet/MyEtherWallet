<template>
  <mew6-white-sheet class="pa-6">
    <div class="d-flex align-center">
      <div class="d-flex align-center">
        <v-skeleton-loader type="avatar" />
        <div class="ml-2">
          <v-skeleton-loader type="text" width="200px" />
          <v-skeleton-loader type="heading" width="300px" />
          <v-skeleton-loader type="text" width="200px" class="mt-2" />
        </div>
      </div>
      <div class="d-flex flex-grow-1 justify-end">
        <v-skeleton-loader
          type="button"
          width="35px"
          height="30px"
          class="mr-2"
        />
        <v-skeleton-loader
          type="button"
          width="35px"
          height="30px"
          class="mr-2"
        />
        <v-skeleton-loader
          type="button"
          width="35px"
          height="30px"
          class="mr-2"
        />
        <v-skeleton-loader type="button" width="35px" height="30px" />
      </div>
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
