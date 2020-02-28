<template>
  <WhiteSheet>
    <div>
      <TxConfirmation :open="txConfirmation">aaaaaaaaaaaaa</TxConfirmation>
    </div>

    <v-btn @click="txConfirmation != txConfirmation">Open</v-btn>

    <InterfaceWrap title="Send Transaction">
      Contents!!!!
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
      txConfirmation: false
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
