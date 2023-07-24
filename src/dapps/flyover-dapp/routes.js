const FLYOVER_ROUTE = {
  FLYOVER: {
    NAME: 'Flyover',
    PATH: 'flyover'
  },
  PEGIN: {
    NAME: 'FlyoverPegIN',
    PATH: 'pegin'
  },
  PEGOUT: {
    NAME: 'FlyoverPegOut',
    PATH: 'pegout'
  }
};

const flyoverRouterGuard = (to, from, next) => {
  if (
    // flyover => pegin
    from.name == FLYOVER_ROUTE.FLYOVER.NAME &&
    to.name == FLYOVER_ROUTE.PEGIN.NAME
  ) {
    next();
  } else if (
    // pegin => pegout
    from.name == FLYOVER_ROUTE.PEGIN.NAME &&
    to.name == FLYOVER_ROUTE.PEGOUT.NAME
  ) {
    next();
  } else if (
    // pegout => pegin
    from.name == FLYOVER_ROUTE.PEGOUT.NAME &&
    to.name == FLYOVER_ROUTE.PEGIN.NAME
  ) {
    next();
  }
};

export { FLYOVER_ROUTE, flyoverRouterGuard };
