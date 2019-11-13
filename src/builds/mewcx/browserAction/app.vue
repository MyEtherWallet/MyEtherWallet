<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    const _self = this;
    window.chrome.storage.sync.get(null, item => {
      if (item.hasOwnProperty('defNetwork')) {
        const networkProps = JSON.parse(item['defNetwork']);
        const network = _self.$store.state.Networks[networkProps.key].find(
          actualNetwork => {
            return actualNetwork.url === networkProps.url;
          }
        );
        _self.$store.dispatch('switchNetwork', network).then(() => {
          _self.$store.dispatch('setWeb3Instance');
        });
      } else {
        _self.$store.dispatch('setWeb3Instance');
      }
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
