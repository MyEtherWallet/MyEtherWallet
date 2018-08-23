import store from 'store'
import additional from '../deterministicWalletPaths'

const selectableNetworks = new Map()

const paths = {
  testnetPath: {symbol: 'Testnets', label: 'Testnets', dpath: 'm/44\'/1\'/0\'/0'}, // first address: m/44'/1'/0'/0/0
  classicPath: {symbol: 'ETC', label: 'TREZOR (ETC)', dpath: 'm/44\'/61\'/0\'/0'}, // first address: m/44'/61'/0'/0/0
  defaultDPath: {symbol: 'ETH', label: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox', dpath: 'm/44\'/60\'/0\'/0'}, // first address: m/44'/60'/0'/0/0
  customDPath: {symbol: 'custom', label: 'Custom Path', dpath: 'm/44\'/60\'/1\'/0'} // first address: m/44'/60'/1'/0/0
}

selectableNetworks.set(paths.defaultDPath.symbol, paths.defaultDPath)
selectableNetworks.set(paths.classicPath.symbol, paths.classicPath)
selectableNetworks.set(paths.testnetPath.symbol, paths.testnetPath)
selectableNetworks.set(paths.customDPath.symbol, paths.customDPath)

additional.forEach((entry) => {
  if (entry.valid.includes('trezor')) {
    paths[entry.chain] = entry.values
    selectableNetworks.set(entry.values.symbol, entry.values)
  }
})

function getDerivationPath (networkName) {
  if (!networkName) {
    if (store.get('network') !== undefined) {
      networkName = store.get('network').type.name
    }
  }

  if (selectableNetworks.has(networkName)) {
    return selectableNetworks.get(networkName)
  } else {
    return paths.defaultDPath
  }

  // switch (networkName) {
  //   case 'ETH':
  //     return paths.defaultDPath
  //   case 'ETC':
  //     return paths.classicPath
  //   case 'ROP':
  //     return paths.testnetPath
  //   case 'RIN':
  //     return paths.testnetPath
  //   case 'KOV':
  //     return paths.testnetPath
  //   case 'EXP':
  //     return paths.hwExpansePath
  //   case 'UBQ':
  //     return paths.hwUbqPath
  //   case 'ELLA':
  //     return paths.hwEllaismPath
  //   case 'EGEM':
  //     return paths.hwEtherGemPath
  //   case 'CLO':
  //     return paths.hwCallistoPath
  //   case 'ETSC':
  //     return paths.hwSocialPath
  //   case 'MUSIC':
  //     return paths.hwMusicoinPath
  //   case 'GO':
  //     return paths.goPath
  //   case 'EOSC':
  //     return paths.hwEOSClassicPath
  //   case 'AKROMA':
  //     return paths.hwAkromaPath
  //   case 'ESN':
  //     return paths.hwESNetworkPath
  //   default:
  //     return paths.defaultDPath
  // }
}

export {
  paths,
  getDerivationPath
}
