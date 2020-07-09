<template>
  <div>
    <v-btn
      depressed
      color="success"
      x-small
      class="mr-1"
      @click.native="openOverlay('transactionTxConfirmation')"
    >
      Dev only: Open TX confirmation window
    </v-btn>

    <mew6-white-sheet>
      <InterfaceWrap title="NFT Manager">
        <mew6-vertical-tabs :tabs="tabs" />
      </InterfaceWrap>
    </mew6-white-sheet>
  </div>
</template>

<script>
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
import CryptoFlowers from './components/CryptoFlowers';
import CryptoKitties from './components/CryptoKitties';
import GodsUnchained from './components/GodsUnchained';
import MyCryptoHeros from './components/MyCryptoHeros';

export default {
  components: { InterfaceWrap },
  data() {
    return {
      tabs: [
        { label: 'CryptoKitties (3)', content: CryptoKitties },
        { label: 'Gods Unchained (2)', content: GodsUnchained },
        { label: 'CryptoFlowers (1)', content: CryptoFlowers },
        { label: 'MyCryptoHeros (1)', content: MyCryptoHeros }
      ]
    };
  },
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    }
  }
};
</script>

<style lang="scss" scoped></style>
