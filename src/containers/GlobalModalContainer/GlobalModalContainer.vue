<template>
  <div>
    <MewConnectQRcode />
    <MewConnectYouTubeTutorial />
    <Wallet />
  </div>
</template>

<script>
import MewConnectQRcode from './components/CreateWallet/MewConnect/QRcode';
import MewConnectYouTubeTutorial from './components/CreateWallet/MewConnect/YouTubeTutorial';
import Wallet from './components/Wallet';

export default {
  name: 'ModalContainer',
  components: { MewConnectQRcode, MewConnectYouTubeTutorial, Wallet }
};
</script>
