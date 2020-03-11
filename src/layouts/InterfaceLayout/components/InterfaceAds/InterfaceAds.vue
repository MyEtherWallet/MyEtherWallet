<template>
  <div class="interface-ads">
    <div class="global__interface-block__margin-top">
      <a
        :title="$t('interface.ads.twitter')"
        href="https://twitter.com/intent/follow?screen_name=myetherwallet"
        onclick="window.open(this.href, 'twitter-share', 'width=580,height=296');return false;"
        rel="noopener noreferrer"
      >
        <div
          class="global__interface-block flex--row--align-center twitter-ad-block"
        >
          <p class="block-title">
            {{ $t('interface.ads.twitter') }}
          </p>
          <div class="margin--left--auto block-twitter">
            <i class="fa fa-twitter"></i>
          </div>
        </div>
      </a>
    </div>
    <div class="global__interface-block__margin-top ad-slider-container">
      <b-carousel
        v-model="slide"
        :interval="adInterval"
        indicators
        controls
        background="#fff"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide>
          <mew-wallet-ad />
        </b-carousel-slide>

        <b-carousel-slide>
          <buy-eth-ad />
        </b-carousel-slide>
      </b-carousel>
    </div>
  </div>
</template>

<script>
import ads from './adComponents';

export default {
  components: {
    'buy-eth-ad': ads.buyEthAd,
    'mew-wallet-ad': ads.mewWalletAd
  },
  props: {},
  data() {
    return {
      slide: 5,
      search: '',
      adImage: '',
      adUrl: '',
      adInterval: 4000,
      currentAdIndex: 1
    };
  },
  methods: {
    pauseAds() {
      if (this.adInterval > 0) {
        this.adInterval = 0;
      } else {
        this.adInterval = 4000;
      }
    },
    onSlideStart() {},
    onSlideEnd() {}
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceAds.scss';
</style>

<style lang="scss">
@import '~@/scss/GlobalVariables';

.ad-slider-container {
  %base {
    height: 30px;
    top: 70px;
  }
  .carousel-control-prev {
    @extend %base;
    left: -10px;

    @media all and (max-width: $mobile-width) {
      left: -25px;
    }
  }
  .carousel-control-next {
    @extend %base;
    right: -10px;

    @media all and (max-width: $mobile-width) {
      right: -25px;
    }
  }
}

.carousel-caption {
  position: relative;
  right: initial;
  bottom: initial;
  left: initial;
  z-index: initial;
  color: initial;
  text-align: initial;

  img {
    width: 100%;
  }
}
</style>
