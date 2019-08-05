<template>
  <div>
    <div class="">
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
    <b-carousel v-model="slide" :interval="4000" controls indicators>
      <!-- Text slides with image -->
      <b-carousel-slide
        caption="First slide"
        text="Nulla vitae elit libero, a pharetra augue mollis interdum."
        img-src="https://picsum.photos/1024/480/?image=52"
      ></b-carousel-slide>

      <!-- Slides with custom text -->
      <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
        <h1>Hello world!</h1>
      </b-carousel-slide>

      <!-- Slides with image only -->
      <b-carousel-slide
        img-src="https://picsum.photos/1024/480/?image=58"
      ></b-carousel-slide>

      <!-- Slides with img slot -->
      <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
      <b-carousel-slide>
        <img
          slot="img"
          class="d-block img-fluid w-100"
          width="1024"
          height="480"
          src="https://picsum.photos/1024/480/?image=55"
          alt="image slot"
        />
      </b-carousel-slide>

      <!-- Slide with blank fluid image to maintain slide aspect ratio -->
      <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          eros felis, tincidunt a tincidunt eget, convallis vel est. Ut
          pellentesque ut lacus vel interdum.
        </p>
      </b-carousel-slide>
    </b-carousel>

    <div class="global__interface-block--margin-top bottom-image-container">
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
