<template>
  <div class="mew-component--enkrypt">
    <mew-popup
      :show="enkryptLandingPopup"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      :left-btn="{
        text: 'Cancel',
        color: 'basic',
        method: neverShowEnkryptLandingPage
      }"
      max-width="430"
      has-body-content
      class="popup"
    >
      <div class="popup-container">
        <img
          class="blob"
          src="@/assets/images/backgrounds/bg-enkrypt.png"
          alt="blob"
        />
        <img :src="white" alt="enkrypt logo" class="enkrypt-logo" />
        <div class="mew-heading-2 heading">
          Our official Browser Extension is here!
        </div>
        <div class="carousel-box">
          <v-carousel cycle height="255" hide-delimiters :show-arrows="false">
            <v-carousel-item v-for="(nft, i) in nfts" :key="i">
              <img :src="nfts[i].src" alt="nft-image" class="main-image" />
            </v-carousel-item>
          </v-carousel>
        </div>
        <div class="mew-heading-4 content text-left">
          Easily access all your favorite apps across <br />Ethereum and
          Polkadot chains.
        </div>
        <div class="width--full px-12">
          <div
            v-for="cText in checkedText"
            :key="cText"
            class="text-left d-flex"
          >
            <img src="@/assets/images/icons/enkrypt/check.svg" class="mr-3" />
            <div>{{ cText }}</div>
          </div>
        </div>
        <div v-lottie="surpriseLottie" class="lottie" />
        <div class="btn-container">
          <a
            href="https://help.myetherwallet.com/en/"
            target="_blank"
            class="learn-more"
            >Learn More</a
          >
          <mew-button
            color-theme="#7E44F2"
            class="extension-btn ml-4"
            @click.native="install"
          >
            <img
              v-if="browser !== 'default'"
              class="chrome-logo mr-3"
              :src="browserLogo"
              alt="chrome"
            />
            {{ text }}
          </mew-button>
        </div>
      </div>
    </mew-popup>
  </div>
</template>
<script>
import imageOne from '@/assets/images/icons/enkrypt/promo1.png';
import imageTwo from '@/assets/images/icons/enkrypt/promo2.png';
import white from '@/assets/images/icons/enkrypt/icon-enkrypt-white.svg';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import enkryptMarketing from '@/core/mixins/enkryptMarketing.mixin.js';
import { mapActions } from 'vuex';
export default {
  name: 'TheEnkryptPopup',
  mixins: [handlerAnalytics, enkryptMarketing],
  data() {
    return {
      white: white,
      nfts: [
        {
          src: imageOne
        },
        {
          src: imageTwo
        }
      ]
    };
  },
  computed: {
    checkedText() {
      return [
        'Lives in your favorite browser',
        'All the wallet features you already love',
        'State of the art security',
        'Hardware wallet support',
        'Use your existing MEW accounts'
      ];
    },
    surpriseLottie() {
      return 'confetti';
    }
  },
  methods: {
    ...mapActions('popups', ['neverShowEnkryptLandingPage']),
    install() {
      // eslint-disable-next-line
      window.open(this.browserLink, '_blank');
      this.trackEnkryptInstall();
      this.neverShowEnkryptLandingPage();
    }
  }
};
</script>
<style lang="scss" scoped>
.popup-container {
  min-height: 706px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 8px;
  margin-top: -30px;
  position: relative;
  overflow: hidden;
}
.lottie {
  position: absolute;
  top: 0px;
  z-index: 0;
}

.blob {
  position: absolute;
  z-index: 0;
  top: -220px;
  right: -120px;
}
.heading {
  z-index: 1;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.carousel-box {
  width: 320px;
  height: 250px;
  border-radius: 8px;
  background: white;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.27);
  overflow: hidden;
  z-index: 2;
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
.btn-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.learn-more {
  color: #939fb9;
}
.mew-pop-btns {
  display: none;
}
.extension-btn {
  width: 235px;
  height: 48px;
}
.chrome-logo {
  width: 25px;
  height: 25px;
}
.enkrypt-logo {
  z-index: 9999;
}
</style>
