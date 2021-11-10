<template>
  <v-row>
    <v-col v-for="(p, key) in data" :key="key" cols="6" lg="3" md="3" sm="4">
      <div class="phrase">
        <span>{{ key + 1 }}.</span> {{ p }}
      </div>
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

<style lang="scss" scoped>
.phrase {
  border-bottom: 1px solid var(--v-greenPrimary-base);
  line-height: 30px;
  span {
    color: var(--v-greenPrimary-base);
  }
}
</style>

<style lang="scss">
.v-application .v-input input {
  min-height: initial !important;
}
</style>
