<template>
  <div class="md-container">
    <div v-html="md"></div>
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
@import 'MdContainer.scss';
</style>
