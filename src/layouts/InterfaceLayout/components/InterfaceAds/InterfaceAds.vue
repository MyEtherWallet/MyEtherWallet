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
    <div class="global__interface-block__margin-top">
      <b-carousel
        v-model="slide"
        :interval="adInterval"
        controls
        indicators
        background="#fff"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide>
          <buy-eth-ad @pauseAds="pauseAds"></buy-eth-ad>
          <!--          <img src="@/assets/images/ads/mewconnect.jpg" />-->
        </b-carousel-slide>
        <b-carousel-slide>
          <img src="~@/assets/images/ads/mewconnect.jpg" />
        </b-carousel-slide>
      </b-carousel>
    </div>

    <!--    <div class="global__interface-block&#45;&#45;margin-top bottom-image-container">
      <div class="ad-container">
        <keep-alive :max="adDetails.length">
          <component
            :is="useComponent()"
            :image="adImage"
            :url="adUrl"
            @pauseAds="pauseAds"
          >
          </component>
        </keep-alive>
      </div>
      <div class="select-dots-container">
        <span v-for="(ad, index) in currentAds" :key="index" class="ad-dot">
          <i
            :class="[
              'fa',
              'fa-circle',
              currentAdIndex !== index ? 'inactive' : 'active'
            ]"
            @click="currentAdIndex = index"
          ></i>
        </span>
      </div>
    </div>-->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterfaceTokensModal from '../InterfaceTokensModal';

const adComponentMapping = {
  buyEthAd: 'buy-eth-ad',
  staticAd: 'static-ad'
};
import ads from './adComponents';

export default {
  components: {
    'interface-tokens-modal': InterfaceTokensModal,
    'buy-eth-ad': ads.buyEthAd,
    'static-ad': ads.staticAd
  },
  props: {},
  data() {
    return {
      slide: 5,
      search: '',
      adImage: '',
      adUrl: '',
      adInterval: 4000,
      currentAdIndex: 1,
      currentAds: [
        {
          component: 'staticAd',
          image: 'mewconnect.png',
          url: 'https://mewconnect.myetherwallet.com/#/'
        },
        {
          component: 'buyEthAd'
        },
        {
          component: 'staticAd',
          image: 'mewconnect.png',
          url: 'https://mewconnect.myetherwallet.com/#/'
        },
        {
          component: 'buyEthAd'
        }
      ],
      adDetails: {
        mewConnect: {
          component: 'staticAd',
          image: 'mewconnect.png',
          url: 'https://mewconnect.myetherwallet.com/#/'
        },
        mewConnect2: {
          component: 'staticAd',
          image: 'mewconnect.png',
          url: 'https://mewconnect.myetherwallet.com/#/'
        },
        buyEth: {
          component: 'buyEthAd'
        }
      }
    };
  },
  computed: {
    ...mapState(['network', 'web3', 'online']),
    currentAd() {
      return this.currentAds[this.currentAdIndex];
    }
  },
  watch: {},
  mounted() {},
  methods: {
    useComponent() {
      if (adComponentMapping[this.currentAd.component]) {
        return adComponentMapping[this.currentAd.component];
      }
      return adComponentMapping['staticAd'];
    },
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

  > img {
    width: 100%;
  }
}
</style>
