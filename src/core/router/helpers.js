import xss from 'xss';

const createWalletProps = route => {
  const walletType = route.query && route.query.type ? route.query.type : '';
  const isSoftware =
    route.params && route.params.overlay && route.params.overlay === 'software'
      ? true
      : false;

  return {
    showSoftwareModule: isSoftware,
    type: walletType
  };
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
  const walletType = route.query && route.query.type ? route.query.type : '';
  const isSoftware =
    route.params && route.params.overlay && route.params.overlay === 'hardw'
      ? true
      : false;

  return {
    showSoftwareModule: isSoftware,
    type: walletType
  };
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
  console.log('huh?', route);
  if (Object.keys(route.query).length > 0) {
    console.log('gets here right?');
    const { fromToken, toToken, amount } = route.query;
    const parsedFromToken = xss(fromToken);
    const parsedToToken = xss(toToken);
    const parsedAmt = xss(amount);
    return {
      tokenInValue: `${parsedAmt}`,
      defaults: {
        fromToken: parsedFromToken,
        toToken: parsedToToken
      }
    };
  }
};

export {
  createWalletProps,
  createRouteGuard,
  accessWalletProps,
  accessRouteGuard,
  swapProps
};
