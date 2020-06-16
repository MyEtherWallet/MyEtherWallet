<template>
  <div class="phrase-block border-radius--5px pa-6">
    <slot />
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({}),
  methods: {}
};
</script>

<style lang="scss" scoped>
.phrase-block {
  border: 1px solid var(--v-emerald-lighten2);
}
</style>
