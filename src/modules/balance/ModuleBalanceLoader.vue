<template>
  <mew6-white-sheet class="mew-component--module-balance-loader pa-6">
    <v-row>
      <v-col cols="12" sm="6" class="d-flex flex-grow-1 align-center">
        <v-skeleton-loader type="avatar" />
        <div class="ml-2 flex-grow-1">
          <v-skeleton-loader
            type="image"
            max-width="150px"
            height="15px"
            class="mb-2"
          />
          <v-skeleton-loader
            type="image"
            max-width="180px"
            height="30px"
            class="mb-2"
          />
          <v-skeleton-loader type="image" max-width="100px" height="15px" />
        </div>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        class="d-flex flex-grow-1 justify-sm-end align-center"
      >
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
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="2">
        <v-skeleton-loader type="text" class="my-6" />
        <v-skeleton-loader type="text" class="my-6" />
        <v-skeleton-loader type="text" class="my-6" />
        <v-skeleton-loader type="text" class="my-6" />
        <v-skeleton-loader type="text" class="my-6" />
      </v-col>
      <v-col cols="10">
        <v-skeleton-loader type="image" />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        sm="6"
        class="d-flex align-center justify-center justify-sm-start flex-column flex-sm-row"
      >
        <v-skeleton-loader
          type="image"
          width="130px"
          height="20px"
          class="ma-1"
        />
        <v-skeleton-loader
          type="image"
          width="130px"
          height="20px"
          class="ma-1"
        />
      </v-col>
      <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
        <v-skeleton-loader type="image" width="200px" height="50px" />
      </v-col>
    </v-row>
  </mew6-white-sheet>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.mew-component--module-balance-loader .v-skeleton-loader__text {
  margin-bottom: 0px !important;
}
</style>
