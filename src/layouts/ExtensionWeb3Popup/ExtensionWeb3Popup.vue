<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState('main', ['Networks']),
    ...mapState('main', ['network', 'web3', 'Networks'])
  },
  created() {
    window.chrome.storage.sync.get(null, obj => {
      const stateVal = [
        'accounts',
        'defChainID',
        'defNetwork',
        'favorites',
        'sites'
      ];
      const newState = {};
      stateVal.forEach(item => {
        if (obj[item]) {
          newState[item] =
            item !== 'defChainID' ? JSON.parse(obj[item]) : obj[item];
        }
      });

      this.setState(newState).then(() => {
        const defNetwork = newState['defNetwork']
          ? this.Networks[newState['defNetwork'].key][0]
          : this.Networks['ETH'][0];
        this.switchNetwork(defNetwork).then(() => {
          this.setWeb3Instance(defNetwork);
        });
      });
    });
  },
  methods: {
    ...mapActions('main', ['setWeb3Instance', 'switchNetwork']),
    ...mapActions('mewcx', ['setState'])
  }
};
</script>
