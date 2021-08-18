<template>
  <div>
    <span>Deviation</span>
    <mew-select />
  </div>
</template>

<script>
export default {
  name: 'AccessWalletKeepkey',
  props: {
    paths: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    console.error('paths', this.paths);
  }
};
</script>
