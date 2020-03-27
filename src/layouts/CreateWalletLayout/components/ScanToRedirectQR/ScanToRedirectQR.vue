<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.getMobileOperatingSystem();
  },
  methods: {
    getMobileOperatingSystem() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/windows phone/i.test(userAgent)) {
        return;
      }

      if (/android/i.test(userAgent)) {
        window.location.href =
          'http://play.google.com/store/apps/details?id=PACKAGEURL';
      }

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        window.location.href = 'https://itunes.apple.com/app/id1464614025';
      }

      if (
        userAgent.match(
          /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i
        )
      ) {
        window.location.href =
          'https://galaxystore.samsung.com/detail/com.myetherwallet.mewwallet?session_id=W_29942474fffbd49127ee223d697f1518';
      }
    }
  }
};
</script>
