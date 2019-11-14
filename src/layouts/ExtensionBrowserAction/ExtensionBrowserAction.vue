<template>
  <div class="cx-container">
    <div class="max-width-limit">
      <cx-menu />
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import CxMenu from '@/containers/HeaderContainer/components/CxMenu';

export default {
  components: {
    'cx-menu': CxMenu
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.cx-container {
  background-color: #cacaca;
  min-width: 960px;
}

.max-width-limit {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
