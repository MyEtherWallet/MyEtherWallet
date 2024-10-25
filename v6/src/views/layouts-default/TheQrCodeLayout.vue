<template>
  <v-container>
    <div class="user-message text-center">
      <div class="d-flex align-center justify-center">
        <div class="mew-heading-2">Redirecting to app store</div>
        <span class="loading-dots text-left mew-heading-2">
          {{ loadingDots }}
        </span>
      </div>

      <div class="mt-3 mx-auto" style="max-width: 400px">
        Click app store button, if you don't get redirected to app store
        automatically.
      </div>

      <div class="mt-10">
        <a href="https://itunes.apple.com/app/id1464614025" target="_blank">
          <img
            src="@/assets/images/icons/button-app-store.svg"
            alt="Play store"
            height="35"
            class="mr-1"
          />
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet"
          target="_blank"
        >
          <img
            src="@/assets/images/icons/button-play-store.svg"
            alt="App store"
            height="35"
          />
        </a>
      </div>
    </div>
  </v-container>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  name: 'ModuleQrCode',
  components: {},
  props: {},
  data() {
    return { loadingDots: '' };
  },
  beforeCreate() {},
  mounted() {
    this.downloadMEWWalletApp();
    this.animateLoadingDots();
  },
  methods: {
    downloadMEWWalletApp() {
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
        this.$router.push({ name: ROUTES_HOME.HOME.NAME });
        window.open('https://www.mewwallet.com/', '_blank');
      }
    },
    animateLoadingDots() {
      const dots = 4;

      setInterval(() => {
        if (this.loadingDots.length < dots)
          this.loadingDots = this.loadingDots + '.';
        else this.loadingDots = '';
      }, 400);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-message {
  padding: 150px 0;
}
.loading-dots {
  width: 15px;
}
</style>
