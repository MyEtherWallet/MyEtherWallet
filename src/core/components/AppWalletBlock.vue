<template>
  <div class="app-wallet-block mx-auto">
    <mew6-white-sheet class="px-12 py-8">
      <h2>{{ title }}</h2>
    </mew6-white-sheet>
  </div>
</template>

<script>
export default {
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
