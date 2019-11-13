<template>
  <div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // Add chrome-extention-root class
    const element = document.getElementById('app');
    element.classList.add('chrome-extention-root');
  }
};
</script>

<style lang="scss">
.chrome-extention-root {
  min-width: 1200px;
}
</style>
