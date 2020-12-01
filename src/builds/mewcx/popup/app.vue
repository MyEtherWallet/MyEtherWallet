<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { ExtensionHelpers } from '@/helpers';
export default {
  name: 'App',
  created() {
    const _self = this;
    window.chrome.storage.sync.get(null, item => {
      ExtensionHelpers.networkSwitch(item, _self);
    });
  }
};
</script>

<style lang="scss">
@import '~@/scss/Global-desktop';
@import '~@/scss/Global-tablet';
@import '~@/scss/Global-mobile';

@import '~@/scss/CustomForms-desktop';
@import '~@/scss/CustomForms-tablet';
@import '~@/scss/CustomForms-mobile';

@import '~@/scss/CustomModal-desktop';
@import '~@/scss/CustomModal-tablet';
@import '~@/scss/CustomModal-mobile';
</style>
