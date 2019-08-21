<template>
  <div class="input-search">
    <slot />
    <img src="@/assets/images/icons/magnifier.svg" />
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'InputSearch.scss';
</style>
