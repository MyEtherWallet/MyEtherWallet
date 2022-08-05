/**
 * Enkrypt reused functions
 */

import platform from 'platform';
import { mapState } from 'vuex';
export default {
  name: 'EnkryptMarketingMixing',
  data() {
    return {
      extensionLinks: {
        chrome: {
          link: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
          img: require('@/assets/images/icons/icon-chrome.svg')
        },
        firefox: {
          link: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
          img: require('@/assets/images/icons/icon-firefox.svg')
        },
        opera: {
          link: 'https://addons.opera.com/en/extensions/details/enkrypt/',
          img: require('@/assets/images/icons/icon-opera.svg')
        },
        default: {
          link: 'https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh',
          img: require('@/assets/images/icons/icon-chrome.svg')
        }
      }
    };
  },
  computed: {
    ...mapState('popups', ['enkryptLandingPopup']),
    browser() {
      const browser = platform.name.toLowerCase();
      if (
        browser !== 'chrome' &&
        browser !== 'firefox' &&
        browser !== 'opera'
      ) {
        return 'default';
      }
      return browser;
    },
    text() {
      return this.browser !== 'default'
        ? `Install for ${platform.name}`
        : 'Download Now';
    },
    browserLogo() {
      return this.extensionLinks[this.browser].img;
    },
    browserLink() {
      return this.extensionLinks[this.browser].link;
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    openEnkrypt() {
      // eslint-disable-next-line
      window.open(
        this.isMobile ? 'https://www.enkrypt.com' : this.browserLink,
        '_blank'
      );
    },
    openMewWallet() {
      if (this.isMobile) {
        const userAgent =
          navigator.userAgent || navigator.vendor || window.opera;
        const isAndroid = /android/i.test(userAgent);
        const isApple = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

        if (isAndroid) {
          window.location.href =
            'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
        } else if (isApple) {
          window.location.href = 'https://itunes.apple.com/app/id1464614025';
        }
      } else {
        // eslint-disable-next-line
        window.open('https://www.mewwallet.com/', '_blank');
      }
    },
    openHelpCenter() {
      // eslint-disable-next-line
      window.open('https://www.enkrypt.com', '_blank');
    }
  }
};
