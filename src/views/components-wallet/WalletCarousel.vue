<template>
  <div class="mew-component--banner-ads cursor--pointer">
    <white-sheet class="overflow--hidden">
      <v-carousel
        v-model="currentSlide"
        height="100%"
        hide-delimiters
        show-arrows-on-hover
        cycle
      >
        <v-carousel-item :ripple="false">
          <a :href="browserLink" target="_blank" @click="trackEnkrypt">
            <img
              class="slide-img"
              src="@/assets/images/slides/slide1.jpg"
              alt="Enkrypt"
            />
          </a>
        </v-carousel-item>
        <v-carousel-item :ripple="false">
          <a @click="openMewWallet">
            <img
              class="slide-img"
              src="@/assets/images/slides/slide2.jpg"
              alt="Enkrypt"
            />
          </a>
        </v-carousel-item>
        <v-carousel-item
          :ripple="false"
          :to="{ name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME }"
          target="_blank"
          @click="trackHardware"
        >
          <img
            class="slide-img"
            src="@/assets/images/slides/slide3.jpg"
            alt="Enkrypt"
          />
        </v-carousel-item>
      </v-carousel>
    </white-sheet>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import { useAmplitude } from '@/core/composables/amplitude';
import { useEnkryptMarketing } from '@/core/composables/enkryptMarketing';
import { useGlobalStore } from '@/core/store/global';

// injections/use
const { $amplitude } = useAmplitude();
const { browserLink } = useEnkryptMarketing();
const { network } = useGlobalStore();

// data
const currentSlide = ref(0);

// methods
const openMewWallet = () => {
  $amplitude.track('WalletSlideMEWWallet', {
    network: network.value.type.name
  });
  window.open('https://download.mewwallet.com/?source=mew_web', '_blank');
};

const trackEnkrypt = () => {
  $amplitude.track('WalletSlideEnkrypt', {
    network: network.value.type.name
  });
};

const trackHardware = () => {
  $amplitude.track('WalletSlideHardware', {
    network: network.value.type.name
  });
};
</script>

<style lang="scss" scoped>
.slide-img {
  width: 100%;
  height: 100%;
}
</style>
