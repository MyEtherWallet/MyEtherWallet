<template>
  <div class="phrase-block border-radius--5px px-7 py-4">
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
  border: 1px solid var(--v-greenPrimary-base);
}
</style>
