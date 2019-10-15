<template>
  <div class="md-container">
    <div class="dynamic-content" v-html="md"></div>
  </div>
</template>

<script>
export default {
  name: 'MdContainer',
  components: {},
  props: {
    md: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.md-container {
  padding: 20px;
}
</style>

<style lang="scss">
@import 'MdContainer.scss';
</style>
