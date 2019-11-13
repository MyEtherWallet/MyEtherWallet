<template>
  <div class="extention-container">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
.extention-container {
  min-width: 1200px;
}
</style>
