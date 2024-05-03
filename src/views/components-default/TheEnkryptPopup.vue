<template>
  <mew-popup
    hide-close-btn
    :show="show"
    :has-buttons="false"
    :has-title="false"
    :has-padding="false"
    :left-btn="leftBtn"
    max-width="500"
    has-body-content
  >
    <div class="the-enkrypt-popup popup-container py-10 px-6 px-sm-15">
      <!-- ======================================================================= -->
      <!-- Popup close button -->
      <!-- ======================================================================= -->
      <v-btn icon class="close-button" @click="neverShowEnkryptWalletPage">
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>

      <!-- ======================================================================= -->
      <!-- Lottie image -->
      <!-- ======================================================================= -->
      <div v-lottie="surpriseLottie" class="lottie" />

      <!-- ======================================================================= -->
      <!-- Header -->
      <!-- ======================================================================= -->
      <div class="text-center mb-6">
        <img :src="white" alt="enkrypt logo" class="enkrypt-logo mb-4" />
        <div class="mew-heading-3 heading">
          Introducing our multi-chain wallet extension!
        </div>
      </div>

      <!-- ======================================================================= -->
      <!-- Carousel -->
      <!-- ======================================================================= -->
      <v-carousel
        class="carousel-images"
        cycle
        height="100%"
        hide-delimiters
        :show-arrows="false"
      >
        <v-carousel-item v-for="(nft, i) in nfts" :key="i">
          <img :src="nfts[i].src" alt="nft-image" class="main-image" />
        </v-carousel-item>
      </v-carousel>

      <!-- ======================================================================= -->
      <!-- Text content -->
      <!-- ======================================================================= -->
      <div class="px-2">
        <div
          class="mew-heading-4 mt-5 mb-4 black--text"
          style="line-height: 24px !important"
        >
          Easily access all your favorite apps across <br />Ethereum and
          Polkadot chains.
        </div>
        <div>
          <div
            v-for="cText in checkedText"
            :key="cText"
            class="d-flex align-center mb-2"
          >
            <div class="purple-dots mr-3" />
            <div class="black--text">{{ cText }}</div>
          </div>
        </div>
      </div>

      <!-- ======================================================================= -->
      <!-- Buttons -->
      <!-- ======================================================================= -->
      <div
        class="d-flex flex-column-reverse flex-md-row align-center justify-space-around mt-6"
      >
        <mew-button
          class="mt-1 mt-md-0"
          color-theme="#939fb9"
          btn-style="transparent"
          @click.native="openHelpCenter"
        >
          <span
            style="letter-spacing: 0.5px; text-transform: none"
            class="font-weight-medium"
          >
            Learn more
          </span>
        </mew-button>
        <mew-button
          style="border-radius: 40px !important"
          color-theme="#7E44F2"
          class="extension-btn"
          @click.native="install"
        >
          <img
            v-if="browser !== 'default'"
            class="chrome-logo mr-3"
            :src="browserLogo"
            alt="chrome"
          />
          <span style="letter-spacing: 0.5px; text-transform: none">
            {{ text }}
          </span>
        </mew-button>
      </div>
    </div>
  </mew-popup>
</template>
<script setup>
import { defineProps, computed } from 'vue';

import imageOne from '@/assets/images/icons/enkrypt/promo1.jpg';
import imageTwo from '@/assets/images/icons/enkrypt/promo2.jpg';
import white from '@/assets/images/icons/enkrypt/icon-enkrypt-white.svg';
import { useEnkryptMarketing } from '@/core/composables/enkryptMarketing';

import { usePopupsStore } from '@/core/store/popups';

// injections/use
const { browserLink, openHelpCenter, browserLogo, browser } =
  useEnkryptMarketing();
const { neverShowEnkryptWalletPage } = usePopupsStore();

defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// data
const nfts = [{ src: imageOne }, { src: imageTwo }];

const checkedText = [
  'Lives in your favorite browser',
  'All the wallet features you already love',
  'State of the art security',
  'Hardware wallet support',
  'Use your existing MEW accounts'
];

const leftBtn = {
  text: 'Cancel',
  color: 'basic',
  method: neverShowEnkryptWalletPage
};

// computed
const surpriseLottie = computed(() => {
  return 'confetti';
});

// methods
const install = () => {
  window.open(browserLink, '_blank');
};
</script>

<style lang="scss" scoped>
.popup-container {
  position: relative;
  background-image: url(~@/assets/images/backgrounds/bg-enkrypt.png);
  background-position: top -280px center;
  background-size: 700px;
  margin-top: -20px;
  position: relative;
  overflow: hidden;
}
.lottie {
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 0;
}
.heading {
  z-index: 1;
  color: #ffffff;
  letter-spacing: 0.15px;
}
.carousel-box {
  border-radius: 8px;
  background: white;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.27);
  overflow: hidden;
}
.purple-dots {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #974bff;
}
.main-image {
  width: 100%;
  height: 100%;
}
.content {
  width: 320px;
  text-align: left;
  color: #192133;
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
}
.extension-btn span {
  font-size: 18px;
  font-weight: 500;
}
.chrome-logo {
  width: 25px;
  height: 25px;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 9;
}

.carousel-images {
  overflow: hidden;
  border-radius: 5px;
}
</style>
