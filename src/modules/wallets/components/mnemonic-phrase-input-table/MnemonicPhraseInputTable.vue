<template>
  <v-row>
    <v-col v-for="(p, key) in data" :key="key" cols="6" lg="2" md="3" sm="4">
      <v-text-field :label="key + 1 + '.'"></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      default: () => [],
      type: Array
    }
  },
  data: () => ({})
};
</script>

<style lang="scss">
.v-application .v-input input {
  min-height: initial !important;
}
</style>
