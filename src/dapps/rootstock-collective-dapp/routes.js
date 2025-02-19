const ROOTSTOCK_COLLECTIVE_ROUTE = {
  MYCOLLECTIVE: {
    NAME: 'MyCollective',
    PATH: 'mycollective'
  },
  PROPOSALS: {
    NAME: 'Proposals',
    PATH: 'proposals'
  }
};

const rootstockCollectiveRouterGuard = (to, from, next) => {
  // Validate route parameters
  if (!to?.name || !from?.name) {
    // eslint-disable-next-line no-console
    console.warn('Invalid route parameters in rootstockCollectiveRouterGuard');
  }
  next();
};

export { ROOTSTOCK_COLLECTIVE_ROUTE, rootstockCollectiveRouterGuard };
