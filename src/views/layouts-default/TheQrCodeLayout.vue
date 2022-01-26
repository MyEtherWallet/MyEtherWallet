<template>
  <div>qr-code</div>
</template>

<script>
export default {
  name: 'ModuleQrCode',
  components: {},
  props: {
    /*
    isSwap: {
      type: Boolean,
      default: false
    }
    */
  },
  data() {
    return {};
  },
  computed: {},
  beforeCreate() {
    const downloadMEWWalletApp = () => {
      console.log('In');
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      const isWindows = /windows phone/i.test(userAgent);

      const isAndroid = /android/i.test(userAgent);

      const isApple = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

      // const isSamsung = userAgent.match(

      // /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i

      // );

      if (isWindows) {
        return;
      } else if (isAndroid) {
        window.location.href =
          'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
      } else if (isApple) {
        window.location.href = 'https://itunes.apple.com/app/id1464614025';
      } else {
        window.open('https://www.mewwallet.com/', '_blank');
      }
    };

    console.log('Out');
    downloadMEWWalletApp();
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
