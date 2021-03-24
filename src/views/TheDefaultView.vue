<template>
  <v-sheet>
    <the-default-header />
    <v-main>
      <!-- <AaveDepositOverlay :open="true" /> -->
      <router-view />
    </v-main>
    <the-default-footer />
  </v-sheet>
</template>

<script>
import TheDefaultHeader from './components-default/TheDefaultHeader';
import TheDefaultFooter from './components-default/TheDefaultFooter';
import AaveDepositOverlay from '@/dapps/aave-dapp/components/AaveDepositOverlay';
export default {
  name: 'TheDefaultView',
  components: {
    TheDefaultHeader,
    TheDefaultFooter,
    AaveDepositOverlay
  }
};
</script>
