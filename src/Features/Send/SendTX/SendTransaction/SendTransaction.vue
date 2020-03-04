<template>
  <WhiteSheet>
    <TxConfirmation :open="openTxConfirmation" :close="closeTxConfirmation" />

    <InterfaceWrap title="Send Transaction">
      Contents!!!!
    </InterfaceWrap>

    <div class="pa-2">
      <v-btn
        depressed
        color="success"
        x-small
        class="mr-1"
        @click="openTxConfirmation = true"
      >
        Open TX confirmation window
      </v-btn>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/components/Common/WhiteSheet';
import InterfaceWrap from '@/components/InterfaceWraps/InterfaceWrap1';
import TxConfirmation from '@/components/Overlays/TxConfirmation';

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
