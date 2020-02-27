<template>
  <div class="home">
    <top-banner />
    <about />
    <faqs />
    <social />
  </div>
</template>

<script>
import AboutContainer from '@/containers/AboutContainer';
import FaqsContainer from '@/containers/FaqsContainer';
import Social from './components/Social';
import TopBanner from './components/TopBanner';
import { mapState } from 'vuex';
import CoolWallet, { generateKeyPair } from '@coolwallets/wallet';
import WebBleTransport from '@coolwallets/transport-web-ble';

const {
  publicKey: appPublicKey,
  privateKey: appPrivateKey
} = generateKeyPair();

// store it locally on web storage
localStorage.setItem('appPublicKey', appPublicKey);
localStorage.setItem('appPrivateKey', appPrivateKey);

const transport = new WebBleTransport();
const coolWallet = new CoolWallet(transport, appPrivateKey);
window.coolWallet = coolWallet;

export default {
  name: 'HomeContainer',
  components: {
    'top-banner': TopBanner,
    about: AboutContainer,
    faqs: FaqsContainer,
    social: Social
  },
  data() {
    return {
      address: '',
      resolvedAddress: ''
    };
  },
  computed: {
    ...mapState('main', ['online'])
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeLayout.scss';
</style>
