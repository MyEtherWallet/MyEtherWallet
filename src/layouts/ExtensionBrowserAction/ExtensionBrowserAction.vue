<template>
  <div class="cx-container">
    <cx-header />
    <keep-alive>
      <div class="max-width-limit">
        <router-view />
      </div>
    </keep-alive>
    <cx-footer />
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
  background-color: #f2f4fa;
  min-width: 960px;
}

.max-width-limit {
  max-width: 1055px;
  margin: 0 auto;
}
</style>
