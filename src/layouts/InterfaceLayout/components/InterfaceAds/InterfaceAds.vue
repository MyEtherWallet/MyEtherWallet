<template>
  <div>
    <div class="twitter-container">
      <div class="twitter-content">
        <a
          href="https://twitter.com/intent/follow?screen_name=myetherwallet"
          onclick="window.open(this.href, 'twitter-share', 'width=580,height=296');return false;"
          title="Share on Twitter"
        >
          <div class="twitter-container">
            <i class="fa fa-twitter"></i>
            <span>{{ $t('common.twitterFollow') }}</span>
          </div>
        </a>
      </div>
    </div>
    <div class="bottom-image-container">
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
    </div>
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
      search: '',
      adImage: '',
      adUrl: '',
      adInterval: {},
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
  mounted() {
    this.rotateAds();
  },
  beforeDestroy() {
    clearInterval(this.adInterval);
    this.adInterval = null;
  },
  methods: {
    rotateAds() {
      this.adInterval = setInterval(() => {
        if (this.currentAdIndex + 1 < this.currentAds.length) {
          this.currentAdIndex += 1;
        } else {
          this.currentAdIndex = 0;
        }
      }, 10000);
    },
    useComponent() {
      if (adComponentMapping[this.currentAd.component]) {
        return adComponentMapping[this.currentAd.component];
      }
      return adComponentMapping['staticAd'];
    },
    pauseAds() {
      if (this.adInterval !== null) {
        clearInterval(this.adInterval);
        this.adInterval = null;
      } else {
        this.rotateAds();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceAds.scss';
</style>
