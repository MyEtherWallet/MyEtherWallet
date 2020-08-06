<template>
  <div>
    <mew-connect-qrcode />
    <mew-connect-youtube-tutorial />
    <wallet />
  </div>
</template>

<script>
import mewConnectQrcode from './components/CreateWallet/MewConnect/QRcode/QRcode';
import mewConnectYoutubeTutorial from './components/CreateWallet/MewConnect/YouTubeTutorial/YouTubeTutorial';
import wallet from './components/Wallet/Wallet';

export default {
  name: 'ModalContainer',
  components: { mewConnectQrcode, mewConnectYoutubeTutorial, wallet }
};
</script>
