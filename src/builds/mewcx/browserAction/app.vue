<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';

export default {
  name: 'App',
  computed: {
    ...mapState('main', ['Networks', 'web3'])
  },
  created() {
    const _self = this;
    window.chrome.storage.sync.get(null, item => {
      if (item.hasOwnProperty('defNetwork')) {
        const networkProps = JSON.parse(item['defNetwork']);
        let network = {};
        if (networkProps.hasOwnProperty('url')) {
          network = _self.Networks[networkProps.key][0];
          window.chrome.storage.sync.set(
            {
              defNetwork: JSON.stringify({
                key: network.type.name,
                service: network.service
              })
            },
            () => {}
          );
        } else {
          network = _self.Networks[networkProps.key][0];
          window.chrome.storage.sync.set({
            defNetwork: JSON.stringify({
              key: network.type.name,
              service: network.service
            })
          });
        }
        _self.switchNetwork(network).then(() => {
          _self.setWeb3Instance().then(() => {
            _self.web3.eth.getGasPrice().then(res => {
              _self.setGasPrice(
                utils.fromWei(new BigNumber(res).toString(), 'gwei')
              );
            });
          });
        });
      } else {
        _self.setWeb3Instance().then(() => {
          _self.web3.eth.getGasPrice().then(res => {
            _self.setGasPrice(
              utils.fromWei(new BigNumber(res).toString(), 'gwei')
            );
          });
        });
      }
    });
  },
  methods: {
    ...mapActions('main', ['setWeb3Instance', 'switchNetwork', 'setGasPrice'])
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
