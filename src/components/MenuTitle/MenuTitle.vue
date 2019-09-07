<template>
  <div class="menu-title">
    <div class="the-title">{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dropdownOpen: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MenuTitle.scss';
</style>
