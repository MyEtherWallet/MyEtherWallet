<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import ENS from 'ethereum-ens';
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('main', ['network', 'web3', 'Networks'])
  },
  mounted() {
    this.fetchNewStore();
  },
  methods: {
    ...mapActions('main', ['switchNetwork', 'setWeb3Instance', 'setENS']),
    fetchNewStore() {
      window.chrome.storage.sync.get(null, obj => {
        const defaultNetwork = obj.hasOwnProperty('defNetwork')
          ? this.Networks[JSON.parse(obj['defNetwork']).key][0]
          : this.Networks['ETH'][0];
        this.switchNetwork(defaultNetwork).then(() => {
          this.setWeb3Instance().then(() => {
            this.setENS(
              new ENS(this.web3.currentProvider, this.network.type.ens.registry)
            );
          });
        });
      });
    }
  }
};
</script>
