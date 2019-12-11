<template>
  <div>
    <!-- <cx-header /> -->
    <keep-alive>
      <router-view />
    </keep-alive>
    <!-- <cx-footer /> -->
  </div>
</template>

<script>
import CxHeader from '@/layouts/ExtensionBrowserAction/components/CxHeader';
import CxFooter from '@/layouts/ExtensionBrowserAction/components/CxFooter';

export default {
  components: {
    'cx-header': CxHeader,
    'cx-footer': CxFooter
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
  max-width: 1024px;
  margin: 0 auto;
}
</style>
