<template>
  <div class="what-is-mew">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.title-security') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content">
          <h4>{{ $t('gettingStarted.helpful-tips.title') }}</h4>

          <div class="tips">
            <div
              v-for="tip in tips"
              :key="$t('gettingStarted.helpful-tips.title') + '-' + tip.title"
            >
              <h5>{{ tip.title }}</h5>
              <i18n v-if="tip.linkText" :path="tip.desc" tag="p">
                <a
                  slot="link"
                  :href="tip.linkUrl"
                  rel="noopener noreferrer"
                  target="_blank"
                  >{{ tip.linkText }}</a
                >
              </i18n>
              <p v-else>{{ tip.desc }}</p>
            </div>
          </div>
        </div>
      </dir>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progressBarValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tips: [
        {
          title: this.$t('gettingStarted.helpful-tips.tip1.title'),
          desc: this.$t('gettingStarted.helpful-tips.tip1.desc'),
          linkText: '',
          linkUrl: ''
        },
        {
          title: this.$t('gettingStarted.helpful-tips.tip2.title'),
          desc: this.$t('gettingStarted.helpful-tips.tip2.desc'),
          linkText: '',
          linkUrl: ''
        },
        {
          title: this.$t('gettingStarted.helpful-tips.tip3.title'),
          desc: 'gettingStarted.helpful-tips.tip3.desc',
          linkText: this.$t('gettingStarted.helpful-tips.tip3.link'),
          linkUrl:
            'https://chrome.google.com/webstore/detail/myetherwallet/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en'
        },
        {
          title: this.$t('gettingStarted.helpful-tips.tip4.title'),
          desc: 'gettingStarted.helpful-tips.tip4.desc',
          linkText: this.$t('gettingStarted.helpful-tips.tip4.link'),
          linkUrl: '#/hardware-wallet-affiliates'
        },
        {
          title: this.$t('gettingStarted.helpful-tips.tip5.title'),
          desc: 'gettingStarted.helpful-tips.tip5.desc',
          linkText: this.$t('gettingStarted.helpful-tips.tip5.link'),
          linkUrl: 'mailto:support@myetherwallet.com'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import '../BlockWithProgressBar-desktop.scss';
@import '../BlockWithProgressBar-tablet.scss';
@import '../BlockWithProgressBar-mobile.scss';
</style>
