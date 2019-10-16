<template functional>
  <div class="search-container">
    <img src="@/assets/images/icons/magnifier.svg" />
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SearchContainer'
};
</script>

<style lang="scss" scoped>
@import 'SearchContainer.scss';
</style>
