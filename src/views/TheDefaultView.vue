<template>
  <div>
    <the-default-header />
    <v-main>
      <router-view />
    </v-main>
    <the-default-footer />
    <the-default-wallet-banner />
    <the-get-mew-wallet />
  </div>
</template>

<script>
import TheDefaultHeader from './components-default/TheDefaultHeader';
import TheDefaultFooter from './components-default/TheDefaultFooter';
import TheDefaultWalletBanner from './components-default/TheDefaultWalletBanner';
import TheGetMewWallet from '@/views/components-default/TheGetMewWallet';

export default {
  name: 'TheDefaultView',
  components: {
    TheDefaultHeader,
    TheDefaultFooter,
    TheDefaultWalletBanner,
    TheGetMewWallet
  }
};
</script>
