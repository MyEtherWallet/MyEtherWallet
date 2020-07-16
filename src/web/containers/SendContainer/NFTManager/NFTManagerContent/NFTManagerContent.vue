<template>
  <mew6-white-sheet>
    <InterfaceWrap title="Swap">
      <mew-tabs :items="items">
        <template v-slot:tabContent0><CryptoFlowers /></template>
        <template v-slot:tabContent1><CryptoKitties /></template>
        <template v-slot:tabContent2><GodsUnchained /></template>
        <template v-slot:tabContent3><MyCryptoHeros /></template>
      </mew-tabs>
    </InterfaceWrap>
  </mew6-white-sheet>
</template>

<script>
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';
import CryptoFlowers from './components/CryptoFlowers';
import CryptoKitties from './components/CryptoKitties';
import GodsUnchained from './components/GodsUnchained';
import MyCryptoHeros from './components/MyCryptoHeros';

export default {
  components: {
    InterfaceWrap,
    CryptoFlowers,
    CryptoKitties,
    GodsUnchained,
    MyCryptoHeros
  },
  data() {
    return {
      items: [
        { name: 'CryptoKitties (3)' },
        { name: 'Gods Unchained (2)' },
        { name: 'CryptoFlowers (1)' },
        { name: 'MyCryptoHeros (1)' }
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
