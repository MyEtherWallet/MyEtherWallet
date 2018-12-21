<template>
  <div class="standard-dropdown">
    <div class="wrap">
      <div class="dropdown-button">
        <p>{{ chosenValue }}</p>
        <i aria-hidden="true" class="fa fa-angle-down"></i>
      </div>
    </div>
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
