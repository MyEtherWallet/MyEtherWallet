import store from 'store'

const paths = {
  defaultDPath: {label: 'Ledger (ETH)', dpath: 'm/44\'/60\'/0\''}, // first address: m/44'/60'/0/0
  classicPath: {label: 'Ledger (ETC)', dpath: 'm/44\'/60\'/160720\'/0\''}, // first address: m/44'/60'/160720'/0/0
  testnetPath: {label: 'Testnets', dpath: 'm/44\'/1\'/0\'/0'}, // first address: m/44'/1'/0'/0/0
  customDPath: {label: 'Custom Path', dpath: 'm/44\'/60\'/1\'/0'}, // first address: m/44'/60'/1'/0/0
  hwUbqPath: {label: 'Ubiq (UBQ)', dpath: 'm/44\'/108\'/0\'/0'}, // first address: m/44'/40'/0'/0/0
  hwExpansePath: {label: 'Expanse (EXP)', dpath: 'm/44\'/40\'/0\'/0'}, // first address: m/44'/40'/0'/0/0
  hwEllaismPath: {label: 'Ellaism (ELLA)', dpath: 'm/44\'/163\'/0\'/0'}, // first address: m/44'/163'/0'/0/0
  hwEtherGemPath: {label: 'EtherGem (EGEM)', dpath: 'm/44\'/1987\'/0\'/0'}, // first address: m/44'/1987'/0'/0/0
  hwCallistoPath: {label: 'Callisto (CLO)', dpath: 'm/44\'/820\'/0\'/0'}, // first address: m/44'/820'/0'/0/0
  hwSocialPath: {label: 'Ethereum Social (ETSC)', dpath: 'm/44\'/1128\'/0\'/0'}, // first address: m/44'/1128'/0'/0/0
  hwMusicoinPath: {label: 'Musicoin (MUSIC)', dpath: 'm/44\'/184\'/0\'/0'}, // first address: m/44'/184'/0'/0/0
  singularDTVPath: {label: 'SingularDTV ', dpath: 'm/0\'/0\'/0\''}, // first address: m/0'/0'/0'/0
  goPath: {label: 'GoChain (GO)', dpath: 'm/44\'/6060\'/0\'/0'}, // first address: m/44'/6060'/0'/0/0
  hwEOSClassicPath: {label: 'EOS Classic (EOS)', dpath: 'm/44\'/2018\'/0\'/0'}, // first address: m/44'/2018'/0'/0/0
  hwAkromaPath: {label: 'Akroma (AKA)', dpath: 'm/44\'/200625\'/0\'/0'}, // first address: m/44'/200625'/0'/0/0
  hwESNetworkPath: {label: 'EtherSocial (ESN)', dpath: 'm/44\'/31102\'/0\'/0'} // first address: m/44'/31102'/0'/0/0
}

function getDerivationPath (networkName) {
  if (!networkName) {
    if (store.get('network') !== undefined) {
      networkName = store.get('network').type.name
    }
  }
  switch (networkName) {
    case 'ETH':
      return paths.defaultDPath
    case 'ETC':
      return paths.classicPath
    case 'EXP':
      return paths.hwExpansePath
    case 'UBQ':
      return paths.hwUbqPath
    case 'POA':
      return paths.defaultDPath
    case 'AKROMA':
      return paths.hwAkromaPath
    default:
      return paths.defaultDPath
  }
}

export {
  paths,
  getDerivationPath
}
