import xss from 'xss';

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
    const walletType = type ? DocumentType : '';
    const isSoftware =
      route.params && route.params.overlay && route.params.overlay === 'hardw'
        ? true
        : false;

    return {
      showSoftwareModule: isSoftware,
      type: walletType
    };
  }
};

const accessRouteGuard = (to, from, next) => {
  if (to.params.overlay === undefined) {
    next();
  } else {
    const validOverlays = ['hardware', 'mobile', 'software'];
    if (to.query.type === validOverlays[0]) {
      const validTypes = [
        'overview',
        'ledger',
        'finney',
        'keepkey',
        'coolwallet',
        'xwallet',
        'bitbox',
        'secalot',
        'trezor',
        'bcvault'
      ];
      if (validTypes.includes(to.query.type)) {
        next();
      } else {
        next('*');
      }
    }
    if (to.query.type === validOverlays[1]) {
      const validTypes = ['overview'];
      if (validTypes[0] === to.query.type) {
        next();
      } else {
        next('*');
      }
    }
    if (to.query.type === validOverlays[2]) {
      const validTypes = ['keystore', 'mnemonic', 'private-key', 'overview'];
      if (validTypes.includes(to.query.type)) {
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
  swapProps,
  swapRouterGuard
};
