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
    ...mapState('mewcx', ['defNetwork'])
  },
  created() {
    const newNetwork = this.Networks[this.defNetwork.key][0];
    this.switchNetwork(newNetwork).then(() => {
      this.setWeb3Instance().then(() => {
        console.log(this.web3);
      });
    });
  },
  methods: {
    ...mapActions('main', ['setWeb3Instance', 'switchNetwork'])
  }
};
</script>
