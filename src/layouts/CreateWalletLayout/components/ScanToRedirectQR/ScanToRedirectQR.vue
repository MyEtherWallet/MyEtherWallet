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
      if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
        window.location.href =
          'http://play.google.com/store/apps/details?id=PACKAGEURL';
      }
      if (navigator.userAgent.toLowerCase().indexOf('iphone') > -1) {
        window.location.href = 'https://itunes.apple.com/app/id1464614025';
      }
    }
    // getMobileOperatingSystem() {
    //   console.error(('in here'))
    //   const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    //   // Windows Phone must come first because its UA also contains "Android"
    //   if (/windows phone/i.test(userAgent)) {
    //     return 'Windows Phone';
    //   }

    //   if (/android/i.test(userAgent)) {
    //     return 'Android';
    //   }

    //   // iOS detection from: http://stackoverflow.com/a/9039885/177710
    //   if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    //     console.error("hihihihi")
    //   }

    //   if (
    //     userAgent.match(
    //       /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i
    //     )
    //   ) {
    //     console.log("it's Samsung");
    //   }

    //   return 'unknown';
    // }
  }
};
</script>
