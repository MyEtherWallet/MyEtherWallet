<template>
  <v-row>
    <v-col v-for="(p, key) in data" :key="key"> {{ key + 1 }}. {{ p }} </v-col>
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
