<template>
  <div>
    <v-btn
      depressed
      color="success"
      x-small
      class="mr-1"
      @click="openTxConfirmation = true"
    >
      Open TX confirmation window
    </v-btn>

    <WhiteSheet>
      <TxConfirmation :open="openTxConfirmation" :close="closeTxConfirmation" />
      <InterfaceWrap title="Send Transaction">
        Contents!!!!
      </InterfaceWrap>
    </WhiteSheet>
  </div>
</template>

<script>
//import Var from '@/common/plugins/variables.js';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
import TxConfirmation from '@/components/Overlays/TxConfirmation';
//import StdButton from '@/web/components/StdButton';

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
