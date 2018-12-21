<template>
  <div class="standard-dropdown">
    <div>{{ chosenValue }}</div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      chosenValue: 'CA'
    };
  },
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'StandardDropdown.scss';
</style>
