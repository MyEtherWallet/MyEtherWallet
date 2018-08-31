const ledger = {
  defaultDPath: { label: 'Ledger (ETH)', dpath: "m/44'/60'/0'" }, // first address: m/44'/60'/0/0
  classicPath: { label: 'Ledger (ETC)', dpath: "m/44'/60'/160720'/0'" } // first address: m/44'/60'/160720'/0/0
};

const trezor = {
  testnetPath: { label: 'Testnets', dpath: "m/44'/1'/0'/0" }, // first address: m/44'/1'/0'/0/0
  classicPath: { label: 'TREZOR (ETC)', dpath: "m/44'/61'/0'/0" }, // first address: m/44'/61'/0'/0/0
  defaultDPath: {
    label: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox',
    dpath: "m/44'/60'/0'/0"
  } // first address: m/44'/60'/0'/0/0
};

const paths = {
  defaultDPath: {
    label: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox',
    dpath: "m/44'/60'/0'/0"
  }, // first address: m/44'/60'/0'/0/0
  classicPath: { label: 'ETC', dpath: "m/44'/61'/0'/0" }, // first address: m/44'/61'/0'/0/0
  testnetPath: { label: 'Testnets', dpath: "m/44'/1'/0'/0" }, // first address: m/44'/1'/0'/0/0
  customDPath: { label: 'Custom Path', dpath: "m/44'/60'/1'/0" }, // first address: m/44'/60'/1'/0/0
  hwUbqPath: { label: 'Ubiq (UBQ)', dpath: "m/44'/108'/0'/0" }, // first address: m/44'/40'/0'/0/0
  hwExpansePath: { label: 'Expanse (EXP)', dpath: "m/44'/40'/0'/0" }, // first address: m/44'/40'/0'/0/0
  hwEllaismPath: { label: 'Ellaism (ELLA)', dpath: "m/44'/163'/0'/0" }, // first address: m/44'/163'/0'/0/0
  hwEtherGemPath: { label: 'EtherGem (EGEM)', dpath: "m/44'/1987'/0'/0" }, // first address: m/44'/1987'/0'/0/0
  hwCallistoPath: { label: 'Callisto (CLO)', dpath: "m/44'/820'/0'/0" }, // first address: m/44'/820'/0'/0/0
  hwSocialPath: { label: 'Ethereum Social (ETSC)', dpath: "m/44'/1128'/0'/0" }, // first address: m/44'/1128'/0'/0/0
  hwMusicoinPath: { label: 'Musicoin (MUSIC)', dpath: "m/44'/184'/0'/0" }, // first address: m/44'/184'/0'/0/0
  singularDTVPath: { label: 'SingularDTV ', dpath: "m/0'/0'/0'" }, // first address: m/0'/0'/0'/0
  goPath: { label: 'GoChain (GO)', dpath: "m/44'/6060'/0'/0" }, // first address: m/44'/6060'/0'/0/0
  hwEOSClassicPath: { label: 'EOS Classic (EOS)', dpath: "m/44'/2018'/0'/0" }, // first address: m/44'/2018'/0'/0/0
  hwAkromaPath: { label: 'Akroma (AKA)', dpath: "m/44'/200625'/0'/0" }, // first address: m/44'/200625'/0'/0/0
  hwESNetworkPath: { label: 'EtherSocial (ESN)', dpath: "m/44'/31102'/0'/0" } // first address: m/44'/31102'/0'/0/0
};

export { paths, ledger, trezor };

export function getDerivationPath(networkName, deviceBrand) {
  if (deviceBrand) {
    if (deviceBrand === 'ledger') {
      switch (networkName) {
        case 'ETH':
          return ledger.defaultDPath;
        case 'ETC':
          return ledger.classicPath;
        case 'EXP':
          return paths.hwExpansePath;
        case 'UBQ':
          return paths.hwUbqPath;
        case 'POA':
          return ledger.defaultDPath;
        case 'AKROMA':
          return paths.hwAkromaPath;
        default:
          return ledger.defaultDPath;
      }
    } else if (deviceBrand === 'trezor') {
      switch (networkName) {
        case 'ETH':
          return paths.defaultDPath;
        case 'ETC':
          return trezor.classicPath;
        case 'Ropsten':
          return trezor.testnetPath;
        case 'Rinkeby':
          return trezor.testnetPath;
        case 'Kovan':
          return trezor.testnetPath;
        case 'EXP':
          return paths.hwExpansePath;
        case 'UBQ':
          return paths.hwUbqPath;
        case 'ELLA':
          return paths.hwEllaismPath;
        case 'EGEM':
          return paths.hwEtherGemPath;
        case 'CLO':
          return paths.hwCallistoPath;
        case 'ETSC':
          return paths.hwSocialPath;
        case 'MUSIC':
          return paths.hwMusicoinPath;
        case 'GO':
          return paths.goPath;
        case 'EOSC':
          return paths.hwEOSClassicPath;
        case 'AKROMA':
          return paths.hwAkromaPath;
        case 'ESN':
          return paths.hwESNetworkPath;
        default:
          return paths.defaultDPath;
      }
    }
  } else {
    switch (networkName) {
      case 'ETH':
        return paths.defaultDPath;
      case 'ETC':
        return paths.classicPath;
      case 'Ropsten':
        return paths.testnetPath;
      case 'Rinkeby':
        return paths.testnetPath;
      case 'Kovan':
        return paths.testnetPath;
      case 'EXP':
        return paths.hwExpansePath;
      case 'UBQ':
        return paths.hwUbqPath;
      case 'CLO':
        return paths.hwCallistoPath;
      case 'ETSC':
        return paths.hwSocialPath;
      case 'MUSIC':
        return paths.hwMusicoinPath;
      case 'GO':
        return paths.goPath;
      case 'EOSC':
        return paths.hwEOSClassicPath;
      case 'AKROMA':
        return paths.hwAkromaPath;
      case 'ESN':
        return paths.hwESNetworkPath;
      default:
        return paths.defaultDPath;
    }
  }
}
