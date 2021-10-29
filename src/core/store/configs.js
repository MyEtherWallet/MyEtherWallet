import { dappStoreConfigs } from '@/dapps/dappsStore';
export default {
  LOCAL_STORAGE_KEYS: {
    global: 'global-store',
    notifications: 'notifications-store',
    custom: 'custom-store',
    ...dappStoreConfigs.LOCAL_STORAGE_KEYS
  },
  VERSION: {
    global: '1.0.3',
    notifications: '1.0.1',
    custom: '1.0.2',
    ...dappStoreConfigs.VERSION
  }
};
