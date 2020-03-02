<template>
  <WhiteSheet>
    <TxConfirmation :open="openTxConfirmation">
      <template v-slot:closeButton>
        <TextButton
          type="close"
          size="normal"
          @click.native="openTxConfirmation = false"
        >
          <v-icon class="mr-1">mdi-close-circle-outline</v-icon>Cancel
        </TextButton>
      </template>
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
import TextButton from '@/components/Buttons/TextButton1';

//import StdButton from '@/components/StdButton';

export default {
  components: { WhiteSheet, InterfaceWrap, TxConfirmation, TextButton },
  data() {
    return {
      openTxConfirmation: false
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
