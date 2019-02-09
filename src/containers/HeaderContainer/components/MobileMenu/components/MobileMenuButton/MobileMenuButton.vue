<template>
  <div class="mobile-menu-button">
    <div class="wrap">
      <button
        :class="isMobileMenuOpen ? 'menu-open' : ''"
        class="menu-button"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <div class="bar bar-1" />
        <div class="bar bar-2" />
        <div class="bar bar-3" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    ismenuopen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMobileMenuOpen: false
    };
  },
  computed: {},
  watch: {
    ismenuopen(newVal) {
      this.isMobileMenuOpen = newVal;
    }
  },
  mounted() {},
  created() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MobileMenuButton.scss';
</style>
