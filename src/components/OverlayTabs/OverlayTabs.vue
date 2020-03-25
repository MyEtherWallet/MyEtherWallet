<template>
  <div class="overlay-tabs">
    <slot />
  </div>
</template>

<script>
export default {
  components: {},
  props: {}
};
</script>

<style lang="scss">
.overlay-tabs .v-tabs-bar {
  display: none;
}

.overlay-tabs .v-tabs-items {
  background-color: transparent;
}
</style>
