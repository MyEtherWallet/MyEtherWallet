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
  if (
    // collective => proposals
    from.name == ROOTSTOCK_COLLECTIVE_ROUTE.MYCOLLECTIVE.NAME &&
    to.name == ROOTSTOCK_COLLECTIVE_ROUTE.PROPOSALS.NAME
  ) {
    next();
  } else if (
    // proposals => collective
    from.name == ROOTSTOCK_COLLECTIVE_ROUTE.PROPOSALS.NAME &&
    to.name == ROOTSTOCK_COLLECTIVE_ROUTE.MYCOLLECTIVE.NAME
  ) {
    next();
  } else {
    next();
  }
};

export { ROOTSTOCK_COLLECTIVE_ROUTE, rootstockCollectiveRouterGuard };
