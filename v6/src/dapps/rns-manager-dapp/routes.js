const RNS_MANAGER_ROUTE = {
  RNS_MANAGER: { NAME: 'RNSManager', PATH: 'rns' },
  CORE: {
    NAME: 'RNSManager',
    PATH: 'rns'
  },
  MANAGE: {
    NAME: 'RNSManagerManage',
    PATH: 'manage'
  },
  RNS_1: { NAME: 'RNS1', PATH: 'rns-1' },
  RNS_2: { NAME: 'RNS2', PATH: 'rns-2' },
  RNS_3: { NAME: 'RNS3', PATH: 'rns-3' }
};

const rnsRouterGuard = (to, from, next) => {
  if (
    // RNS MANAGER => RNS 1
    from.name == RNS_MANAGER_ROUTE.RNS_MANAGER.NAME &&
    to.name == RNS_MANAGER_ROUTE.RNS_1.NAME
  ) {
    next();
  } else if (
    // RNS 1 => RNS 2
    from.name == RNS_MANAGER_ROUTE.RNS_1.NAME &&
    to.name == RNS_MANAGER_ROUTE.RNS_2.NAME
  ) {
    next();
  } else if (
    // RNS 2 => RNS 3
    from.name == RNS_MANAGER_ROUTE.RNS_2.NAME &&
    to.name == RNS_MANAGER_ROUTE.RNS_3.NAME
  ) {
    next();
  }
};

export { RNS_MANAGER_ROUTE, rnsRouterGuard };
