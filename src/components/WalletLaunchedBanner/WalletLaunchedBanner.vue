<template>
  <div
    :class="[
      'footer-banner-container',
      isExpanded ? 'footer-banner-expanded' : 'footer-banner'
    ]"
  >
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
      alt="MEW wallet screenshot"
    />
    <div
      :class="['detail-content', isExpanded ? 'detail-content-expanded' : '']"
      @click="toggleBanner()"
    >
      <p>
        {{
          isExpanded
            ? $t('home.mew-wallet-modal.hide')
            : $t('home.mew-wallet-modal.details')
        }}
      </p>
      <i :class="['fa', isExpanded ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
    </div>
  </div>
</template>

<script>
import appStore from '@/assets/images/icons/button-app-store.png';
import googlePlay from '@/assets/images/icons/button-google-play-color.png';
import galaxyStore from '@/assets/images/icons/button-galaxy-store-color.png';

export default {
  data() {
    return {
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
        },
        {
          src: galaxyStore,
          url:
            'https://galaxystore.samsung.com/detail/com.myetherwallet.mewwallet?session_id=W_29942474fffbd49127ee223d697f1518'
        }
      ]
    };
  },
  methods: {
    toggleBanner() {
      this.isExpanded = !this.isExpanded;
    }
  }
};
</script>

<style lang="scss">
@import 'WalletLaunchedBanner.scss';

.wallet-launch-modal {
  .modal-body {
    padding: 0;
  }
  .modal-dialog {
    max-width: 820px;
  }
}
</style>
