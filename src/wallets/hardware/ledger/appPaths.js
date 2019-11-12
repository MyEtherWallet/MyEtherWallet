import {
  AKA,
  ATH,
  CLO,
  EGEM,
  ELLA,
  ESN,
  ETC,
  ETH,
  ETHO,
  EXP,
  GO,
  MIX,
  MUSIC,
  POA,
  PIRL,
  REOSC,
  ROP,
  RSK,
  RSKTEST,
  TOMO,
  UBQ,
  TT,
  PHT
} from '@/networks/types';
import {
  ledgerEthereum,
  ledgerLiveEthereum,
  ledgerEthereumClassic,
  ledgerLiveEthereumClassic,
  ropsten,
  expanse,
  ubiq,
  ellaism,
  etherGem,
  callisto,
  musicoin,
  goChain,
  akroma,
  etherSocialNetwork,
  pirl,
  ether1,
  poaNetwork,
  atheios,
  reoscChain,
  tomoChain,
  mixBlockchain,
  rskMainnet,
  rskTestnet,
  thundercore,
  lightstreamsNetwork
} from '../../bip44/paths';
const appList = [
  {
    network: ETH,
    prefixes: ["m/44'/60'"],
    paths: [ledgerEthereum, ledgerLiveEthereum]
  },
  {
    network: ELLA,
    prefixes: ["m/44'/163'"],
    paths: [ellaism]
  },
  {
    network: ETC,
    prefixes: ["m/44'/61'", "m/44'/60'"],
    paths: [ledgerEthereumClassic, ledgerLiveEthereumClassic]
  },
  {
    network: ESN,
    prefixes: ["m/44'/31102'"],
    paths: [etherSocialNetwork]
  },
  {
    network: ETHO,
    prefixes: ["m/44'/1313114'"],
    paths: [ether1]
  },
  {
    network: EXP,
    prefixes: ["m/44'/40'"],
    paths: [expanse]
  },
  {
    network: PIRL,
    prefixes: ["m/44'/164'"],
    paths: [pirl]
  },
  {
    network: POA,
    prefixes: ["m/44'/60'"],
    paths: [poaNetwork]
  },
  {
    network: RSK,
    prefixes: ["m/44'/137'"],
    paths: [rskMainnet]
  },
  {
    network: RSKTEST,
    prefixes: ["m/44'/37310'"],
    paths: [rskTestnet]
  },
  {
    network: UBQ,
    prefixes: ["m/44'/108'"],
    paths: [ubiq]
  },
  {
    network: AKA,
    prefixes: ["m/44'/200625'"],
    paths: [akroma]
  },
  {
    network: MUSIC,
    prefixes: ["m/44'/184'"],
    paths: [musicoin]
  },
  {
    network: CLO,
    prefixes: ["m/44'/820'"],
    paths: [callisto]
  },
  {
    network: EGEM,
    prefixes: ["m/44'/1987'"],
    paths: [etherGem]
  },
  {
    network: ATH,
    prefixes: ["m/44'/1620'"],
    paths: [atheios]
  },
  {
    network: GO,
    prefixes: ["m/44'/6060'"],
    paths: [goChain]
  },
  {
    network: MIX,
    prefixes: ["m/44'/76'"],
    paths: [mixBlockchain]
  },
  {
    network: REOSC,
    prefixes: ["m/44'/2894'"],
    paths: [reoscChain]
  },
  {
    network: TOMO,
    prefixes: ["m/44'/889'"],
    paths: [tomoChain]
  },
  {
    network: ROP,
    prefixes: ["m/44'/1'"],
    paths: [ropsten]
  },
  {
    network: TT,
    prefixes: ["m/44'/1001'"],
    paths: [thundercore]
  },
  {
    network: PHT,
    prefixes: ["m/44'/60'"],
    paths: [lightstreamsNetwork]
  }
];
export default appList;
