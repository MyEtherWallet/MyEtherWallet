<template>
  <div class="progress-step d-flex">
    <span>Current: {{ details.currentValidatorsStaked }}</span>
    <span>Total: {{ details.totalValidators }} </span>
  </div>
</template>

<script>
export default {
  props: {
    details: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    details(newVal) {
      if (newVal && newVal.totalValidators === newVal.currentValidatorsStaked) {
        this.$emit('completed', true);
      }
    }
  }
  // computed: {
  // },
  // mounted() {
  // },
  // methods: {
  // }
};
</script>

<style lang="scss" scoped>
@import 'InProgress.scss';
</style>
