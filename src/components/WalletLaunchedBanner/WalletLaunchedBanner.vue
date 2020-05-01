<template>
  <div
    v-if="!hideBanner"
    :class="[
      'footer-banner-container',
      isExpanded ? 'footer-banner-expanded' : 'footer-banner'
    ]"
  >
    <div
      :class="['detail-content', isExpanded ? 'detail-content-expanded' : '']"
      @click="toggleBanner()"
    >
      <p>
        {{
          isExpanded
            ? $t('home.mew-wallet-modal.less')
            : $t('home.mew-wallet-modal.more')
        }}
      </p>
      <i :class="['fa', isExpanded ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
    </div>
    <div :class="[isExpanded ? 'center-content-expanded' : 'center-content']">
      <div :class="['title-row', isExpanded ? 'bottom-space' : '']">
        <span>{{ $t('home.mew-wallet-modal.title') }}</span>
      </div>
      <div :class="['btn-container', isExpanded ? 'bottom-space' : '']">
        <a v-for="(btn, idx) in storeButtons" :key="idx" :href="btn.url">
          <img :src="btn.src" alt="App button" />
        </a>
      </div>
      <div v-if="isExpanded" class="footer-text">
        <p>{{ $t('home.mew-wallet-modal.footer-text') }}</p>
        <a href="https://www.mewwallet.com/" target="_blank"
          >{{ $t('home.mew-wallet-modal.learn-more') }}...
        </a>
      </div>
    </div>
    <img
      v-if="isExpanded"
      class="mew-connect-image"
      src="@/assets/images/icons/snippet-mew-wallet.png"
      :alt="$t('home.mew-wallet-modal.img-desc')"
    />
    <div v-if="!isExpanded" class="close-container" @click="setHideBanner()">
      <p>{{ $t('home.mew-wallet-modal.hide') }}</p>
    </div>
  </div>
</template>

<script>
import appStore from '@/assets/images/icons/button-app-store.png';
import googlePlay from '@/assets/images/icons/button-google-play-color.png';
import store from 'store';

export default {
  data() {
    return {
      hideBanner: false,
      isExpanded: false,
      storeButtons: [
        {
          src: appStore,
          url: 'https://itunes.apple.com/app/id1464614025'
        },
        {
          src: googlePlay,
          url:
            'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet'
        }
      ]
    };
  },
  mounted() {
    this.hideBanner = store.get('hideBanner');
  },
  methods: {
    toggleBanner() {
      this.isExpanded = !this.isExpanded;
    },
    setHideBanner() {
      this.hideBanner = true;
      store.set('hideBanner', true);
    }
  }
};
</script>

<style lang="scss">
@import 'WalletLaunchedBanner.scss';
</style>
