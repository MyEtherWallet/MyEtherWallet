<template>
  <WhiteSheet>
    <TxConfirmation :open="openTxConfirmation" :close="closeTxConfirmation">
    </TxConfirmation>

    <InterfaceWrap title="Send Transaction">
      Contents!!!!
      <v-btn @click="openTxConfirmation = true">Open</v-btn>
    </InterfaceWrap>
  </WhiteSheet>
</template>

<script>
//import Var from '@/variables.js';
import WhiteSheet from '@/components/Common/WhiteSheet';
import InterfaceWrap from '@/components/InterfaceWraps/InterfaceWrap1';
import TxConfirmation from '@/components/Overlays/TxConfirmation';

//import StdButton from '@/components/StdButton';

export default {
  components: { WhiteSheet, InterfaceWrap, TxConfirmation },
  data() {
    return {
      openTxConfirmation: false
    };
  },
  methods: {
    closeTxConfirmation() {
      this.openTxConfirmation = false;
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
