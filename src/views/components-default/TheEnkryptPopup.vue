<template>
  <div class="mew-component--enkrypt">
    <mew-popup
      :show="showEnkrypt"
      :has-buttons="false"
      :has-title="false"
      :has-padding="false"
      :left-btn="{ text: 'Cancel', color: 'basic', method: closeEnkryptPopup }"
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
        <span class="mew-heading-2 heading mt-7">Enkrypt</span>
        <span class="mew-heading-2 heading">
          Our official Browser Extension is here!
        </span>
        <div class="carousel-box">
          <v-carousel cycle height="255" hide-delimiters :show-arrows="false">
            <v-carousel-item v-for="(nft, i) in nfts" :key="i">
              <img :src="nfts[i].src" alt="nft-image" class="main-image" />
            </v-carousel-item>
          </v-carousel>
        </div>
        <span class="mew-heading-4 content">
          Connect to web3 on Ethereum and Polkadot, manage your NFTs, buy, send
          and swap. <br />Welcome to the multichain future.
        </span>
        <div v-if="showEnkrypt" v-lottie="surpriseLottie" class="lottie" />
        <div class="btn-container">
          <a href="" class="learn-more">Learn More</a>
          <mew-button color-theme="#7E44F2" class="extension-btn ml-4">
            <img
              class="chrome-logo mr-3"
              src="@/assets/images/icons/icon-chrome.svg"
              alt="chrome"
            />
            Install Extension
          </mew-button>
        </div>
      </div>
    </mew-popup>
  </div>
</template>
<script>
import imageOne from '@/assets/images/icons/enkrypt/promo1.png';
import imageTwo from '@/assets/images/icons/enkrypt/promo2.png';
export default {
  name: 'TheEnkryptPopup',
  data() {
    return {
      showEnkrypt: false,
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
    surpriseLottie() {
      return 'confetti';
    }
  },
  mounted() {
    this.showEnkrypt = true;
  },
  methods: {
    closeEnkryptPopup() {
      this.showEnkrypt = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.popup-container {
  height: 590px;
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
  // border-radius: 8px;
  // background: white;
  // box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.27);
  // z-index: 1;
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
</style>
