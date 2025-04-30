const isStakingBannerOpen = state => {
  const dateNow = Date.now();
  const passedCurrentDate = state.reopenStakingBannerOn < dateNow;
  return passedCurrentDate;
};
export default {
  isStakingBannerOpen
};
