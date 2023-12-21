/**
 * Enkrypt reused functions
 */

import platform from 'platform';

export default {
  name: 'EnkryptMarketingMixing',
  data() {
    return {
      extensionLinks: {
        'microsoft edge': {
          link: 'https://microsoftedge.microsoft.com/addons/detail/enkrypt-ethereum-polkad/gfenajajnjjmmdojhdjmnngomkhlnfjl',
          img: require('@/assets/images/icons/icon-edge.svg')
        },
        firefox: {
          link: 'https://addons.mozilla.org/en-US/firefox/addon/enkrypt/',
          img: require('@/assets/images/icons/icon-firefox.svg')
        },
        safari: {
          link: 'https://apps.apple.com/app/enkrypt-web3-wallet/id1640164309',
          img: require('@/assets/images/icons/icon-safari.svg')
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
    browser() {
      const browser = platform.name?.toLowerCase() || '';
      if (!this.extensionLinks[browser]) {
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
      window.open(
        this.isMobile ? 'https://www.enkrypt.com' : this.browserLink,
        '_blank'
      );
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
