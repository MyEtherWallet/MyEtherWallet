<template>
  <div class="progress-step d-flex">
    <div class="content-container d-flex">
      <h3>Hang on tight!</h3>
      <p class="subtitle">
        Please do not close your browser or exit this Dapp,
        <br />
        We are creating validators for your Eth2 stake.
      </p>
      <b-progress :max="total" class="w-100" height="2rem">
        <b-progress-bar :value="details.currentValidatorsStaked" animated />
      </b-progress>
      <p class="validator-progress">
        <strong>{{ details.currentValidatorsStaked }} / {{ total }}</strong>
        Validators are completed
      </p>
    </div>
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
  computed: {
    total() {
      return this.details.amount / 32;
    }
  },
  watch: {
    details: {
      handler: function (newVal) {
        if (
          newVal &&
          newVal.totalValidators === newVal.currentValidatorsStaked
        ) {
          this.$emit('completed', true, { key: 'stake', value: true });
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InProgress.scss';
</style>
