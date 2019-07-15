<template>
  <div>
    <div class="bottom-image-container">
      <div class="twitter-container">
        <i class="fa fa-twitter"></i> <span>Follow us on Twitter</span>

      </div>

      <div class="ad-container">
        <component :is="useComponent()" :image="adImage" :url="adUrl">
        </component>
      </div>
      <div class="select-dots-container">
        <span v-for="(ad, index) in currentAds" :key="index" class="ad-dot">
          <i
            :class="['fa', 'fa-circle', currentAdIndex !== index ? 'inactive' : 'active']"
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
      currentAdIndex: 0,
      currentAds: [
        {
          component: 'staticAd',
          image: 'mewconnect.jpeg',
          url: 'https://mewconnect.myetherwallet.com/#/'
        },
        {
          component: 'buyEthAd'
        },
        {
          component: 'staticAd',
          image: 'mewconnect2.jpeg',
          url: 'https://mewconnect.myetherwallet.com/#/'
        },
        {
          component: 'buyEthAd'
        }
      ],
      adDetails: {
        mewConnect: {
          component: 'staticAd',
          image: 'mewconnect.jpeg',
          url: 'https://mewconnect.myetherwallet.com/#/'
        },
        mewConnect2: {
          component: 'staticAd',
          image: 'mewconnect2.png',
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
  methods: {
    rotateAds() {
      setInterval(() => {
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceAds.scss';
</style>
