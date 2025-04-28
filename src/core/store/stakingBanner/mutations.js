import localStore from 'store';
import Configs from '../configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakingBanner)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakingBanner);
    if (savedStore.stateVersion === Configs.VERSION.stakingBanner) {
      Object.assign(state, savedStore);
    }
  }
};

const SET_REOPEN_STAKING_BANNER_ON = function (state) {
  const SIXTY_DAYS = 5184000000;
  const currentTime = new Date().getTime();
  const reopenStakingBannerOn = currentTime + SIXTY_DAYS;
  state.reopenStakingBannerOn = reopenStakingBannerOn;
};

export default {
  INIT_STORE,
  SET_REOPEN_STAKING_BANNER_ON
};
