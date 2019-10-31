<template>
  <div class="flexbox">
    <slot />
  </div>
</template>

<script>
export default {
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.flexbox {
  display: flex;
  align-items: center;
}
</style>
