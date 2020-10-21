<template>
  <div
    :class="[
      type,
      type === 'in' ? 'txIn' : '',
      type === 'out' ? 'txOut' : '',
      type === 'swap' ? 'swap' : '',
      type === 'error' ? 'error' : '',
      type === 'warning' ? 'warning' : ''
    ]"
    class="text-uppercase mew-component--badge white--text font-weight-bold text-center"
  >
    {{ type }}
  </div>
</template>

<script>
export default {
  props: {
    type: {
      default: '',
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.mew-component--badge {
  padding: 0.02rem 0.37rem;
  display: inline-block;
  border-radius: 3px;
  font-size: 0.8rem;
}
</style>
