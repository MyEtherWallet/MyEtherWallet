import {
  ledgerEthereum,
  ledgerLiveEthereum,
  ropsten,
  ledgerEthereumClassic,
  ledgerLiveEthereumClassic,
  tomoChain,
  etherGem,
  expanse,
  ubiq,
  ellaism,
  callisto,
  etherSocialNetwork,
  musicoin,
  goChain,
  akroma,
  pirl,
  atheios,
  mixBlockchain,
  rskMainnet
} from '@/wallets/bip44/paths.js';

import eth from '@/assets/images/networks/eth.svg';
import etc from '@/assets/images/networks/etc.svg';
import aka from '@/assets/images/networks/aka.svg';
import ella from '@/assets/images/networks/ella.svg';
import egem from '@/assets/images/networks/egem.svg';
import exp from '@/assets/images/networks/exp.svg';
import go from '@/assets/images/networks/go.svg';
import music from '@/assets/images/networks/music.svg';
import pirlimg from '@/assets/images/networks/pirl.svg';
import rsk from '@/assets/images/networks/rsk.svg';
import ubq from '@/assets/images/networks/ubq.svg';
import clo from '@/assets/images/networks/clo.svg';
import tomo from '@/assets/images/networks/tomo.svg';
import esn from '@/assets/images/networks/esn.svg';
import ath from '@/assets/images/icons/network.svg';
import mix from '@/assets/images/icons/network.svg';

const ETH = {
  name: 'ETH',
  paths: [ledgerEthereum, ledgerLiveEthereum, ropsten],
  icon: eth
};

const ETC = {
  name: 'ETC',
  paths: [ledgerEthereumClassic, ledgerLiveEthereumClassic],
  icon: etc
};

const TOMO = {
  name: 'TOMO',
  paths: [tomoChain],
  icon: tomo
};

const EGEM = {
  name: 'EGEM',
  paths: [etherGem],
  icon: egem
};

const EXP = {
  name: 'EXP',
  paths: [expanse],
  icon: exp
};

const UBIQ = {
  name: 'UBIQ',
  paths: [ubiq],
  icon: ubq
};

const ELLA = {
  name: 'ELLA',
  paths: [ellaism],
  icon: ella
};

const CLO = {
  name: 'CLO',
  paths: [callisto],
  icon: clo
};

const ESN = {
  name: 'ESN',
  paths: [etherSocialNetwork],
  icon: esn
};

const MUSIC = {
  name: 'MUSIC',
  paths: [musicoin],
  icon: music
};

const GO = {
  name: 'GO',
  paths: [goChain],
  icon: go
};

const AKA = {
  name: 'AKA',
  paths: [akroma],
  icon: aka
};

const PIRL = {
  name: 'PIRL',
  paths: [pirl],
  icon: pirlimg
};

const ATH = {
  name: 'ATH',
  paths: [atheios],
  icon: ath
};

const MIX = {
  name: 'MIX',
  paths: [mixBlockchain],
  icon: mix
};

const RSK = {
  name: 'RSK',
  paths: [rskMainnet],
  icon: rsk
};

export default [
  ETH,
  ETC,
  TOMO,
  EGEM,
  EXP,
  UBIQ,
  ELLA,
  CLO,
  ESN,
  MUSIC,
  GO,
  AKA,
  PIRL,
  ATH,
  MIX,
  RSK
];
