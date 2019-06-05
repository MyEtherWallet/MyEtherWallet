<template>
  <div class="what-is-mew">
    <div class="block-progressbar">
      <dir class="block-progressbar__container">
        <div class="block-progressbar__title">
          {{ $t('gettingStarted.aboutSecurity') }}
        </div>
        <div class="block-progressbar__progressbar">
          <div :class="progressBarValue" />
        </div>
        <div class="block-progressbar__content">
          <h4>{{ $t('gettingStarted.tipsTitle') }}</h4>

          <div class="tips">
            <div
              v-for="tip in tips"
              :key="$t('gettingStarted.tipsTitle') + '-' + tip.title"
            >
              <h5>{{ tip.title }}</h5>
              <p>
                {{ tip.desc }}
                <a
                  v-if="tip.linkText"
                  :href="tip.linkUrl"
                  rel="noopener noreferrer"
                  target="_blank"
                  >{{ tip.linkText }}</a
                >
                {{ tip.descCont !== '' ? tip.descCont : '' }}
              </p>
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
          title: this.$t('gettingStarted.tip1Title'),
          desc: this.$t('gettingStarted.tip1Desc'),
          linkText: '',
          linkUrl: '',
          descCont: ''
        },
        {
          title: this.$t('gettingStarted.tip2Title'),
          desc: this.$t('gettingStarted.tip2Desc'),
          linkText: '',
          linkUrl: '',
          descCont: ''
        },
        // {
        //   title: this.$t('gettingStarted.tip3Title'),
        //   desc: this.$t('gettingStarted.tip3Desc'),
        //   linkText: this.$t('gettingStarted.tip3DescLink'),
        //   linkUrl:
        //     'https://chrome.google.com/webstore/detail/myetherwallet/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en',
        //   descCont: this.$t('gettingStarted.tip3DescCont')
        // },
        {
          title: this.$t('gettingStarted.tip4Title'),
          desc: this.$t('gettingStarted.tip4Desc'),
          linkText: this.$t('gettingStarted.tip4DescLink'),
          linkUrl: '',
          descCont: ''
        },
        {
          title: this.$t('gettingStarted.tip5Title'),
          desc: this.$t('gettingStarted.tip5Desc'),
          linkText: this.$t('gettingStarted.tip5DescLink'),
          linkUrl: 'mailto:support@xinfin.network',
          descCont: this.$t('gettingStarted.tip5DescCont')
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
