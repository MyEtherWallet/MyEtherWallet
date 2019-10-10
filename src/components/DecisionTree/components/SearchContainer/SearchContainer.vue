<template>
  <div class="search-container">
    <img src="@/assets/images/icons/magnifier.svg" />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SearchContainer',
  components: {},
  props: {},
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'SearchContainer.scss';
</style>
