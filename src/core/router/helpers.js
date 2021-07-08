import xss from 'xss';
import { SOFTWARE_WALLET_TYPES } from '@/modules/access-wallet/software/handlers/helpers';

const ACCESS_VALID_OVERLAYS = {
  HARDWARE: 'hardware',
  MOBILE: 'mobile',
  SOFTWARE: 'software'
};

const ROUTES_HOME = {
  Home: { Name: 'Home', Path: '' },
  HowItWorks: { Name: 'HowItWorks', Path: 'how-it-works' },
  SecurityPolicy: { Name: 'SecurityPolicy', Path: 'security-policy' },
  PrivacyPolicy: { Name: 'PrivacyPolicy', Path: 'privacy-policy' },
  TermsOfService: { Name: 'TermsOfService', Path: 'terms-of-service' },
  Tools: { Name: 'Tools', Path: 'tools' },
  BuyHardwareWallet: { Name: 'BuyHardwareWallet', Path: 'company' },
  CompanyPage: { Name: 'CompanyPage', Path: 'company' },
  TeamPage: { Name: 'TeamPage', Path: 'team' },
  PressKit: { Name: 'PressKit', Path: 'presskit' },
  CreateWallet: { Name: 'CreateWallet', Path: 'wallet/create/:overlay?' },
  AccessWallet: { Name: 'AccessWallet', Path: 'wallet/create/:overlay?' },
};
const ROUTES_WALLET = {
  Wallets: { Name: 'Wallets', Path: '' },
  Dashboard: { Name: 'Dashboard', Path: '/dashboard' },
  SendTX: { Name: 'SendTX', Path: 'send-tx' },
  NFTManager: { Name: 'NFTManager', Path: 'nft' },
  Swap: { Name: 'Swap', Path: 'swap' },
  Dapps: { Name: 'Dapps', Path: 'dapps' },
  DeployContract: { Name: 'DeployContract', Path: 'deploy' },
  InteractWithContract: { Name: 'InteractWithContract', Path: 'interact' },
  SignMessage: { Name: 'SignMessage', Path: 'sign' },
  VerifyMessage: { Name: 'verifyMessage', Path: 'verify' }
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
        'finney',
        'keepkey',
        'coolwallet',
        'xwallet',
        'bitbox',
        'trezor',
        'bcvault'
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

export {
  createWalletProps,
  createRouteGuard,
  accessWalletProps,
  accessRouteGuard,
  ACCESS_VALID_OVERLAYS,
  swapProps,
  swapRouterGuard,
  ROUTES_HOME,
  ROUTES_WALLET
};
