<template>
  <div class="cx-container">
    <b-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.cx-container {
  background-color: #cacaca;
  padding-top: 70px;
}
</style>
