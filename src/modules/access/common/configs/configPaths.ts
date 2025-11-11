export interface DerivationPath {
  path: string
  label: string,
  type: string
}
const ethereum: DerivationPath = {
  path: "m/44'/60'/0'/0",
  label: 'Ethereum',
  type: 'EVM'
}
const poaNetwork: DerivationPath = {
  path: "m/44'/60'/0'/0",
  label: 'POA network',
  type: 'EVM'
}
const ethereumClassic: DerivationPath = {
  path: "m/44'/61'/0'/0",
  label: 'Ethereum Classic',
  type: 'EVM'
}
const ropsten: DerivationPath = {
  path: "m/44'/1'/0'/0",
  label: 'Ropsten Testnet',
  type: 'EVM'
}
const singularDTV: DerivationPath = {
  path: "m/0'/0'/0'",
  label: 'SingularDTV',
  type: 'EVM'
}
const expanse: DerivationPath = {
  path: "m/44'/40'/0'/0",
  label: 'Expanse',
  type: 'EVM'
}
const ubiq: DerivationPath = {
  path: "m/44'/108'/0'/0",
  label: 'Ubiq',
  type: 'EVM'
}
const ellaism: DerivationPath = {
  path: "m/44'/163'/0'/0",
  label: 'Ellaism',
  type: 'EVM'
}
const etherGem: DerivationPath = {
  path: "m/44'/1987'/0'/0",
  label: 'EtherGem',
  type: 'EVM'
}
const callisto: DerivationPath = {
  path: "m/44'/820'/0'/0",
  label: 'Callisto',
  type: 'EVM'
}
const ethereumSocial: DerivationPath = {
  path: "m/44'/1128'/0'/0",
  label: 'Ethereum Social',
  type: 'EVM'
}
const musicoin: DerivationPath = {
  path: "m/44'/184'/0'/0",
  label: 'Musicoin',
  type: 'EVM'
}
const goChain: DerivationPath = {
  path: "m/44'/6060'/0'/0",
  label: 'GoChain',
  type: 'EVM'
}
const xdcnetwork: DerivationPath = {
  path: "m/44'/550'/0'/0",
  label: 'XDC Network',
  type: 'EVM'
}
const eosClassic: DerivationPath = {
  path: "m/44'/2018'/0'/0",
  label: 'EOS Classic',
  type: 'EVM'
}
const akroma: DerivationPath = {
  path: "m/44'/200625'/0'/0",
  label: 'Akroma',
  type: 'EVM'
}
const etherSocialNetwork: DerivationPath = {
  path: "m/44'/31102'/0'/0",
  label: 'EtherSocial Network',
  type: 'EVM'
}
const pirl: DerivationPath = {
  path: "m/44'/164'/0'/0",
  label: 'PIRL',
  type: 'EVM'
}
const ether1: DerivationPath = {
  path: "m/44'/1313114'/0'/0",
  label: 'Ether-1',
  type: 'EVM'
}
const atheios: DerivationPath = {
  path: "m/44'/1620'/0'/0",
  label: 'Atheios',
  type: 'EVM'
}

const tomoChain: DerivationPath = {
  path: "m/44'/889'/0'/0",
  label: 'TomoChain',
  type: 'EVM'
}
const mixBlockchain: DerivationPath = {
  path: "m/44'/76'/0'/0",
  label: 'Mix Blockchain',
  type: 'EVM'
}
const iolite: DerivationPath = {
  path: "m/44'/1171337'/0'/0",
  label: 'Iolite',
  type: 'EVM'
}
const ledgerEthereum: DerivationPath = {
  path: "m/44'/60'/0'",
  label: 'Ethereum',
  type: 'EVM'
}
const ledgerLiveEthereum: DerivationPath = {
  path: "m/44'/60'",
  label: 'Ethereum - Ledger Live',
  type: 'EVM'
}
const ledgerEthereumClassic: DerivationPath = {
  path: "m/44'/60'/160720'/0'",
  label: 'Ethereum Classic',
  type: 'EVM'
}
const ledgerLiveEthereumClassic: DerivationPath = {
  path: "m/44'/61'",
  label: 'Ethereum Classic - Ledger Live',
  type: 'EVM'
}
const rskMainnet: DerivationPath = {
  path: "m/44'/137'/0'/0",
  label: 'Rootstock Mainnet',
  type: 'EVM'
}
const rskTestnet: DerivationPath = {
  path: "m/44'/37310'/0'/0",
  label: 'Rootstock Testnet',
  type: 'EVM'
}
const keepkeyEthereum: DerivationPath = {
  path: "m/44'/60'",
  label: 'Ethereum',
  type: 'EVM'
}
const keepkeyEthereumClassic: DerivationPath = {
  path: "m/44'/61'",
  label: 'Ethereum Classic',
  type: 'EVM'
}
const thundercore: DerivationPath = {
  path: "m/44'/1001'/0'/0",
  label: 'ThunderCore',
  type: 'EVM'
}
const solidum: DerivationPath = {
  path: "m/44'/997'/0'/0",
  label: 'Solidum',
  type: 'EVM'
}
const metadium: DerivationPath = {
  path: "m/44'/916'/0'/0",
  label: 'Metadium',
  type: 'EVM'
}
const reoscChain: DerivationPath = {
  path: "m/44'/2894'/0'/0",
  label: 'REOSC',
  type: 'EVM'
}
const dexon: DerivationPath = {
  path: "m/44'/237'/0'/0",
  label: 'DEXON Network',
  type: 'EVM'
}
const lightstreamsNetwork: DerivationPath = {
  path: "m/44'/60'/0'",
  label: 'Lightstreams Network',
  type: 'EVM'
}
const mintmeComCoin: DerivationPath = {
  path: "m/44'/227'/0'/0",
  label: 'MintMe.com Coin',
  type: 'EVM'
}
const ethercore: DerivationPath = {
  path: "m/44'/466'/0'/0",
  label: 'EtherCore',
  type: 'EVM'
}
const binanceChain: DerivationPath = {
  path: "m/44'/714'",
  label: 'Binance Chain',
  type: 'EVM'
}


// Bitcoin specific derivation paths
const bip84Segwit: DerivationPath = {
  label: "Bitcoin",
  path: "m/84'/0'/0'/0",
  type: "BITCOIN"
}

const bip84SegwitTest: DerivationPath = {
  label: "Bitcoin Test",
  path: "m/84'/1'/0'/0",
  type: "BITCOIN"
}

const dogecoinPath: DerivationPath = {
  label: "Dogecoin",
  path: "m/44'/3'/0'/0",
  type: "DOGECOIN"
}

const litecoinPath: DerivationPath = {
  label: "Litecoin",
  path: "m/44'/2'/0'/0",
  type: "LITECOIN"
}

export {
  ethereum,
  ethereumClassic,
  ledgerEthereum,
  ledgerLiveEthereum,
  ledgerEthereumClassic,
  ledgerLiveEthereumClassic,
  ropsten,
  singularDTV,
  expanse,
  ubiq,
  ellaism,
  etherGem,
  callisto,
  ethereumSocial,
  musicoin,
  goChain,
  xdcnetwork,
  eosClassic,
  akroma,
  etherSocialNetwork,
  pirl,
  ether1,
  atheios,
  tomoChain,
  mixBlockchain,
  iolite,
  rskMainnet,
  rskTestnet,
  keepkeyEthereum,
  keepkeyEthereumClassic,
  thundercore,
  solidum,
  metadium,
  poaNetwork,
  reoscChain,
  dexon,
  lightstreamsNetwork,
  mintmeComCoin,
  ethercore,
  binanceChain
}

// bitcoin paths
export {
  bip84Segwit,
  bip84SegwitTest,
  dogecoinPath,
  litecoinPath
}
