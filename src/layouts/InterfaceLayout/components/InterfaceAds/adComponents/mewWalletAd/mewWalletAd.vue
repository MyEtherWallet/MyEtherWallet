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
            <i18n tag="h3" path="interface.ads.mew-wallet">
              <span slot="new" class="new-label">{{
                $t('interface.ads.new')
              }}</span>
              <p slot="officially-released">
                {{ $t('interface.ads.officially-released') }}
              </p>
            </i18n>
          </div>
          <div class="bottom-block">
            <a v-for="(btn, idx) in storeButtons" :key="idx" :href="btn.url">
              <img :src="btn.src" alt="App button" />
            </a>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import appStore from '@/assets/images/icons/button-app-store.png';
import googlePlay from '@/assets/images/icons/button-google-play-color.png';
// import galaxyStore from '@/assets/images/icons/button-galaxy-store-color.png';

export default {
  props: {},
  data() {
    return {
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
  }
};
</script>

<style lang="scss" scoped>
@import 'mewWalletAd.scss';
</style>
