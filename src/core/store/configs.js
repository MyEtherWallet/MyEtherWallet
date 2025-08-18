import { dappStoreConfigs } from '@/dapps/dappsStore';
export default {
  LOCAL_STORAGE_KEYS: {
    global: 'global-store',
    popups: 'popups-store',
    survey: 'survey-store',
    notifications: 'notifications-store',
    custom: 'custom-store',
    addressBook: 'address-book',
    article: 'article-store',
    stakingBanner: 'staking-banner-store',
    ...dappStoreConfigs.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    global: '1.0.9',
    popups: '1.0.2',
    survey: '1.0.0',
    notifications: '1.0.4',
    custom: '1.0.4',
    addressBook: '1.0.0',
    article: '1.0.0',
    stakingBanner: '1.0.0',
    ...dappStoreConfigs.VERSION
  }
};
