import xss from 'xss';
import { SOFTWARE_WALLET_TYPES } from '@/modules/access-wallet/software/handlers/helpers';
import { ROUTES_WALLET } from '../configs/configRoutes';

const ACCESS_VALID_OVERLAYS = {
  HARDWARE: 'hardware',
  MOBILE: 'mobile',
  SOFTWARE: 'software'
};

const stripQuery = queryObj => {
  const newObj = {};
  Object.keys(queryObj).forEach(key => {
    newObj[key] = xss(queryObj[key]);
  });

  return newObj;
};

const createWalletProps = route => {
  if (Object.keys(route.query).length > 0) {
    const { type } = stripQuery(route.query);
    const walletType = type ? type : '';
    const isSoftware =
      route.params &&
      route.params.overlay &&
      route.params.overlay === 'software'
        ? true
        : false;

    return {
      showSoftwareModule: isSoftware,
      type: walletType
    };
  }
};
const createRouteGuard = (to, from, next) => {
  if (to.params.overlay === undefined) {
    next();
  } else if (to.params.overlay === 'software') {
    const validTypes = ['keystore', 'mnemonic', 'overview'];
    if (validTypes.includes(to.query.type)) {
      next();
    } else {
      next('*');
    }
  } else {
    next('*');
  }
};

const accessWalletProps = route => {
  if (Object.keys(route.query).length > 0) {
    const { type } = stripQuery(route.query);
    const walletType = type ? type : '';
    const overlay =
      route.params && route.params.overlay ? route.params.overlay : '';
    return {
      overlay: overlay,
      type: walletType
    };
  }
};

const accessRouteGuard = (to, from, next) => {
  if (to.params.overlay === undefined) {
    next();
  } else {
    if (to.params.overlay === ACCESS_VALID_OVERLAYS.HARDWARE) {
      const validTypes = [
        'overview',
        'ledger',
        'keepkey',
        'coolwallet',
        'bitbox02',
        'trezor'
      ];
      if (validTypes.includes(to.query.type)) {
        next();
      } else {
        next('*');
      }
    }
    if (to.params.overlay === ACCESS_VALID_OVERLAYS.MOBILE) {
      const validTypes = ['overview'];
      if (validTypes[0] === to.query.type) {
        next();
      } else {
        next('*');
      }
    }
    if (to.params.overlay === ACCESS_VALID_OVERLAYS.SOFTWARE) {
      if (Object.values(SOFTWARE_WALLET_TYPES).includes(to.query.type)) {
        next();
      } else {
        next('*');
      }
    }
  }
};

const swapProps = route => {
  if (Object.keys(route.query).length > 0) {
    const { fromToken, toToken, amount } = stripQuery(route.query);
    const parsedFromToken = fromToken;
    const parsedToToken = toToken;
    const parsedAmt = amount;
    return {
      tokenInValue: parsedAmt,
      defaults: {
        fromToken: parsedFromToken,
        toToken: parsedToToken
      }
    };
  }
};

const swapRouterGuard = (to, from, next) => {
  const queries = Object.keys(to.query);
  if (queries.length === 0) {
    next();
  } else {
    const validQueries = ['toToken', 'fromToken', 'amount'];
    for (let i = 0; i < queries.length; i++) {
      if (validQueries.includes(queries[i])) return next();
    }
    next('*');
  }
};

const ensRouterGuard = (to, from, next) => {
  if (
    // ENS MANAGER => ENS 1
    from.name == ROUTES_WALLET.ENS_MANAGER.NAME &&
    to.name == ROUTES_WALLET.ENS_1.NAME
  ) {
    next();
  } else if (
    // ENS 1 => ENS 2
    from.name == ROUTES_WALLET.ENS_1.NAME &&
    to.name == ROUTES_WALLET.ENS_2.NAME
  ) {
    next();
  } else if (
    // ENS 2 => ENS 3
    from.name == ROUTES_WALLET.ENS_2.NAME &&
    to.name == ROUTES_WALLET.ENS_3.NAME
  ) {
    next();
  }
};

const stakedRouterGuard = (to, from, next) => {
  if (
    // STAKED => STAKED 1
    from.name == ROUTES_WALLET.STAKED.NAME &&
    to.name == ROUTES_WALLET.STAKED_1.NAME
  ) {
    next();
  } else if (
    // STAKED 1 => STAKED 2
    from.name == ROUTES_WALLET.STAKED_1.NAME &&
    to.name == ROUTES_WALLET.STAKED_2.NAME
  ) {
    next();
  } else if (
    // STAKED 2 => STAKED 3
    from.name == ROUTES_WALLET.STAKED_2.NAME &&
    to.name == ROUTES_WALLET.STAKED_3.NAME
  ) {
    next();
  } else if (
    // STAKED 3 => STAKED 4
    from.name == ROUTES_WALLET.STAKED_3.NAME &&
    to.name == ROUTES_WALLET.STAKED_4.NAME
  ) {
    next();
  }
};

export {
  createWalletProps,
  createRouteGuard,
  accessWalletProps,
  accessRouteGuard,
  ACCESS_VALID_OVERLAYS,
  swapProps,
  swapRouterGuard,
  ensRouterGuard,
  stakedRouterGuard
};
