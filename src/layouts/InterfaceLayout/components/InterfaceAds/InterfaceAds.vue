<template>
  <div class="interface-ads">
    <div class="global__interface-block__margin-top">
      <a
        :title="$t('common.twitterFollow')"
        href="https://twitter.com/intent/follow?screen_name=myetherwallet"
        onclick="window.open(this.href, 'twitter-share', 'width=580,height=296');return false;"
      >
        <div
          class="global__interface-block flex--row--align-center twitter-ad-block"
        >
          <p class="block-title">
            {{ $t('common.twitterFollow') }}
          </p>
          <div class="margin--left--auto block-twitter">
            <i class="fa fa-twitter"></i>
          </div>
        </div>
      </a>
    </div>
    <div class="global__interface-block__margin-top slider-container">
      <b-carousel
        v-model="slide"
        :interval="adInterval"
        controls
        indicators
        background="#fff"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!--        <b-carousel-slide>
          <buy-eth-ad @pauseAds="pauseAds"></buy-eth-ad>
        </b-carousel-slide>-->
        <b-carousel-slide>
          <mew-connect-ad />
        </b-carousel-slide>
      </b-carousel>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceTokensModal from '../InterfaceTokensModal';

import ads from './adComponents';

export default {
  components: {
    'interface-tokens-modal': InterfaceTokensModal,
    'buy-eth-ad': ads.buyEthAd,
    'static-ad': ads.staticAd,
    'mew-connect-ad': ads.mewConnectAd
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
  computed: {
    ...mapState(['network', 'web3', 'online'])
  },
  watch: {},
  mounted() {},
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
.carousel-caption {
  position: relative;
  right: initial;
  bottom: initial;
  left: initial;
  z-index: initial;
  padding-top: 0px;
  padding-bottom: 0px;
  color: initial;
  text-align: initial;

  img {
    width: 100%;
  }
}
</style>
