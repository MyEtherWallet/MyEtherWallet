<template>
  <div class="background-block">
    <div class="flex-vertical-center">
      <a
        href="https://mewconnect.myetherwallet.com/#/"
        rel="noopener noreferrer"
        target="_blank"
        class="app-store"
      >
        <div class="inner-content">
          <div class="text-content">
            <h3>MEW wallet <span class="new-label">NEW</span></h3>
            <p>Officially Released</p>
          </div>
          <div class="bottom-block">
            <img :src="appStore" />
            <img :src="appStore" />
            <img :src="appStore" />
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import appStore from '@/assets/images/icons/button-app-store.png';
import googlePlay from '@/assets/images/icons/button-google-play-color.png';
import galaxyStore from '@/assets/images/icons/button-galaxy-store-color.png';

export default {
  props: {},
  data() {
    return {
      appStore: appStore,
      googlePlay: googlePlay,
      galaxyStore: galaxyStore,
      showWidget: false,
      suppliedFromAmount: 100,
      suppliedTo: {
        symbol: 'ETH',
        name: ''
      },
      suppliedFrom: {
        symbol: 'USD',
        name: ''
      }
    };
  },
  computed: {
    ...mapState('main', ['account', 'online'])
  },
  watch: {},
  mounted() {},
  methods: {
    showSwapWidget() {
      if (this.online) {
        this.$eventHub.$emit(
          'showSwapWidgetTo',
          this.account.address,
          'USD',
          'ETH',
          1
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'mewWalletAd.scss';
</style>
