import localStore from 'store';

const isStakingBannerOpen = state => {
  const mewTestDate = localStore.get('mew-test-date');
  const dateNow = mewTestDate ? new Date(mewTestDate).getTime() : Date.now();
  const passedCurrentDate = state.reopenStakingBannerOn < dateNow;
  return passedCurrentDate;
};
export default {
  isStakingBannerOpen
};
