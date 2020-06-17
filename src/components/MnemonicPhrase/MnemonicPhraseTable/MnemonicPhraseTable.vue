<template>
  <v-row>
    <v-col v-for="(p, key) in data" :key="key" lg="2" md="3" sm="4">
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
  border-bottom: 1px solid var(--v-emerald-lighten2);
  line-height: 30px;
  span {
    color: var(--v-emerald-base);
  }
}
</style>
