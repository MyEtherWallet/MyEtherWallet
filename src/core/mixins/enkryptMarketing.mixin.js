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
      const browser = platform.name?.toLowerCase() || '';
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
      return this.$vuetify.breakpoint.mdAndDown;
    }
  },
  methods: {
    openEnkrypt() {
      // eslint-disable-next-line
      /*
       window.open(
         this.isMobile ? 'https://www.enkrypt.com' : this.browserLink,
         '_blank'
       );
       */
      window.open('https://www.enkrypt.com', '_blank');
    },
    openMewWallet() {
      // eslint-disable-next-line
      window.open(
        'https://download.mewwallet.com/?source=mew_web_create',
        '_blank'
      );
    },
    openHelpCenter() {
      // eslint-disable-next-line
      window.open('https://www.enkrypt.com', '_blank');
    }
  }
};
