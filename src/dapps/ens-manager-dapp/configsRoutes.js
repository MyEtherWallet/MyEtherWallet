const ENS_MANAGER_ROUTE = {
  ENS_MANAGER: { NAME: 'ENSManager', PATH: 'ens' },
  CORE: {
    NAME: 'ENSManager',
    PATH: 'ens'
  },
  MANAGE: {
    NAME: 'ENSManagerManage',
    PATH: 'manage'
  },
  CLAIM: {
    NAME: 'ENSManagerClame',
    PATH: 'claim'
  },
  REVERSE: {
    NAME: 'ENSReverseLookup',
    PATH: 'reverse'
  },
  ENS_1: { NAME: 'ENS1', PATH: 'ens-1' },
  ENS_2: { NAME: 'ENS2', PATH: 'ens-2' },
  ENS_3: { NAME: 'ENS3', PATH: 'ens-3' }
};

const ensRouterGuard = (to, from, next) => {
  if (
    // ENS MANAGER => ENS 1
    from.name == ENS_MANAGER_ROUTE.ENS_MANAGER.NAME &&
    to.name == ENS_MANAGER_ROUTE.ENS_1.NAME
  ) {
    next();
  } else if (
    // ENS 1 => ENS 2
    from.name == ENS_MANAGER_ROUTE.ENS_1.NAME &&
    to.name == ENS_MANAGER_ROUTE.ENS_2.NAME
  ) {
    next();
  } else if (
    // ENS 2 => ENS 3
    from.name == ENS_MANAGER_ROUTE.ENS_2.NAME &&
    to.name == ENS_MANAGER_ROUTE.ENS_3.NAME
  ) {
    next();
  }
};

export { ENS_MANAGER_ROUTE, ensRouterGuard };
