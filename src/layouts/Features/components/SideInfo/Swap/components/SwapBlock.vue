<template>
  <div
    class="container"
  >
    <!-- <p>{{ pair.amt }} {{ pair.from }} / {{ pair.rate }} {{ pair.to }}</p> -->
  </div>
</template>

<script>
export default {
  props: {
    to: { default: '', type: String },
    from: { default: '', type: String },
    rate: { default: '', type: String },
    amount: { default: '', type: String }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.container {
  background-color: $light-mint;
  border-radius: 4px;
}
</style>
