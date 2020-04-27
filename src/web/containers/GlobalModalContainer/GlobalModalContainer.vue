<template>
  <div>
    <MewConnectQRcode />
    <MewConnectYouTubeTutorial />
  </div>
</template>

<script>
import MewConnectQRcode from './components/CreateWallet/MewConnect/QRcode';
import MewConnectYouTubeTutorial from './components/CreateWallet/MewConnect/YouTubeTutorial';

export default {
  name: 'ModalContainer',
  components: { MewConnectQRcode, MewConnectYouTubeTutorial }
};
</script>
