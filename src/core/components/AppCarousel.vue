<template>
  <div class="mew-component--banner-ads cursor--pointer">
    <mew6-white-sheet class="overflow--hidden">
      <v-carousel
        v-model="currentSlide"
        height="100%"
        hide-delimiters
        show-arrows-on-hover
        cycle
      >
        <v-carousel-item>
          <a href="https://www.enkrypt.com/" target="_blank">
            <img
              class="slide-img"
              src="@/assets/images/slides/slide1.png"
              alt="Enkrypt"
            />
          </a>
        </v-carousel-item>
        <v-carousel-item>
          <a :href="mobileOrWebLink()" target="_blank">
            <img
              class="slide-img"
              src="@/assets/images/slides/slide2.png"
              alt="Enkrypt"
            />
          </a>
        </v-carousel-item>
        <v-carousel-item :to="{ name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME }">
          <img
            class="slide-img"
            src="@/assets/images/slides/slide3.png"
            alt="Enkrypt"
          />
        </v-carousel-item>
      </v-carousel>
    </mew6-white-sheet>
  </div>
</template>

<script>
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import platform from 'platform';

export default {
  data: () => ({
    currentSlide: 0,
    ROUTES_HOME: ROUTES_HOME
  }),
  methods: {
    mobileOrWebLink() {
      if (platform.os.family.includes('iOS')) {
        return 'https://apps.apple.com/app/id1464614025';
      } else if (platform.os.family.includes('Android')) {
        return 'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
      }
      return 'https://www.mewwallet.com/';
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-img {
  width: 100%;
  height: 100%;
}
</style>
