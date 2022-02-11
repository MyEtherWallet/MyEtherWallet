import { dappStoreConfigs } from '@/dapps/dappsStore';
export default {
  LOCAL_STORAGE_KEYS: {
    global: 'global-store',
    notifications: 'notifications-store',
    custom: 'custom-store',
    addressBook: 'address-book',
    ...dappStoreConfigs.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    global: '1.0.7',
    notifications: '1.0.1',
    custom: '1.0.4',
    addressBook: '1.0.0',
    ...dappStoreConfigs.VERSION
  }
};
