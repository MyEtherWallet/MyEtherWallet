<template>
  <div>
    <h3 class="text-center my-4">
      {{ $t('createWallet.mew-wallet.redirect-store') }}
    </h3>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getMobileOperatingSystem();
  },
  methods: {
    getMobileOperatingSystem() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isWindows = /windows phone/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      const isApple = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const isSamsung = userAgent.match(
        /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i
      );

      if (isWindows) {
        return;
      }

      if (isAndroid || isSamsung) {
        window.location.href =
          'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
      }

      if (isApple) {
        window.location.href = 'https://itunes.apple.com/app/id1464614025';
      }
    }
  }
};
</script>
