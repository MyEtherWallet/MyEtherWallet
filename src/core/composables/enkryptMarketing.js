import platform from 'platform';
import { computed } from 'vue';

import { useVuetify } from './vuetify';

export const useEnkryptMarketing = () => {
  const vuetify = useVuetify();
  const extensionLinks = {
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
  };

  // computed
  const browser = computed(() => {
    const detectedBrowser = platform.name?.toLowerCase() || '';
    if (extensionLinks[detectedBrowser]) {
      return 'default';
    }
    return detectedBrowser;
  });

  const text = computed(() => {
    return browser.value !== 'default'
      ? `Install for ${platform.name}`
      : 'Download Now';
  });

  const browserLogo = computed(() => {
    return extensionLinks[browser.value].img;
  });

  const browserLink = computed(() => {
    return extensionLinks[browser.value].link;
  });

  const isMobile = computed(() => {
    return vuetify.breakpoint.mdAndDown;
  });

  // methods
  const openEnkrypt = () => {
    window.open(
      isMobile.value ? 'https://www.enkrypt.com' : browserLink.value,
      '_blank'
    );
  };

  const openMewWallet = () => {
    window.open(
      'https://download.mewwallet.com/?source=mew_web_create',
      '_blank'
    );
  };

  const openHelpCenter = () => {
    window.open('https://www.enkrypt.com', '_blank');
  };

  return {
    extensionLinks,
    browser,
    text,
    openEnkrypt,
    openMewWallet,
    browserLogo,
    browserLink,
    openHelpCenter
  };
};
