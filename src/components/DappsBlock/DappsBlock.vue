<template>
  <div>Dapps</div>
</template>

<script>
export default {
  props: {
    buttonclass: { default: 'button--green', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.btn-min-width {
  min-width: 180px !important;
}

.std-button {
  text-transform: none;
  letter-spacing: 0px;
  font-size: 14px !important;
  font-weight: 500;
}

.button--green {
  background-color: $emerald !important;
  color: white !important;
}

.button--green-border {
  background-color: transparent !important;
  border: 1px solid $emerald;
  color: $emerald !important;
}

.button--white {
  background-color: white !important;
  color: $emerald !important;
}

.button--white-border {
  background-color: transparent !important;
  border: 1px solid white;
  color: white !important;
}

.v-btn--disabled {
  border: 0px;
}
</style>
