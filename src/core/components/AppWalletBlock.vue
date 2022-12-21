<template>
  <div class="app-wallet-block mx-auto">
    <mew6-white-sheet class="px-13 py-8">
      <h2 class="mb-8">{{ title }}</h2>
      <slot></slot>
    </mew6-white-sheet>
  </div>
</template>

<script>
export default {
  name: 'AppWalletBlock',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.app-wallet-block {
  max-width: 540px;
}
</style>
