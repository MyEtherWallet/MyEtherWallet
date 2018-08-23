import store from 'store'
import additional from '../deterministicWalletPaths'

const selectableNetworks = new Map()

const paths = {
  defaultDPath: {symbol: 'ETH', label: 'Ledger (ETH)', dpath: 'm/44\'/60\'/0\''}, // first address: m/44'/60'/0/0
  classicPath: {symbol: 'ETC', label: 'Ledger (ETC)', dpath: 'm/44\'/60\'/160720\'/0\''}, // first address: m/44'/60'/160720'/0/0
  testnetPath: {symbol: 'Testnets', label: 'Testnets', dpath: 'm/44\'/1\'/0\'/0'}, // first address: m/44'/1'/0'/0/0
  customDPath: {symbol: 'custom', label: 'Custom Path', dpath: 'm/44\'/60\'/1\'/0'} // first address: m/44'/60'/1'/0/0
}

selectableNetworks.set(paths.defaultDPath.symbol, paths.defaultDPath)
selectableNetworks.set(paths.classicPath.symbol, paths.classicPath)
selectableNetworks.set(paths.testnetPath.symbol, paths.testnetPath)
selectableNetworks.set(paths.customDPath.symbol, paths.customDPath)

additional.forEach((entry) => {
  if (entry.valid.includes('ledger')) {
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
  //   case 'EXP':
  //     return paths.hwExpansePath
  //   case 'UBQ':
  //     return paths.hwUbqPath
  //   case 'POA':
  //     return paths.defaultDPath
  //   case 'AKROMA':
  //     return paths.hwAkromaPath
  //   default:
  //     return paths.defaultDPath
  // }
}

export {
  paths,
  getDerivationPath
}
