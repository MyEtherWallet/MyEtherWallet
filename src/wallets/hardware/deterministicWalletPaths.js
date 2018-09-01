import * as nodes from '../../configs/networks/types';

const derivationPaths = {
  [nodes.ETH.name]: "m/44'/60'/0'/0",
  [nodes.ETC.name]: "m/44'/61'/0'/0",
  [nodes.ROP.name]: "m/44'/1'/0'/0",
  [nodes.RIN.name]: "m/44'/1'/0'/0",
  [nodes.KOV.name]: "m/44'/1'/0'/0",
  [nodes.EXP.name]: "m/44'/40'/0'/0",
  [nodes.UBQ.name]: "m/44'/108'/0'/0",
  [nodes.POA.name]: "m/44'/60'/0'/0",
  [nodes.AKA.name]: "m/44'/200625'/0'/0",
  [nodes.PIRL.name]: "m/44'/164'/0'/0",
  [nodes.ETHO.name]: "m/44'/1313114'/0'/0",
  [nodes.ELLA.name]: "m/44'/1'/0'/0",
  [nodes.EGEM.name]: "m/44'/1'/0'/0",
  [nodes.CLO.name]: "m/44'/1'/0'/0",
  [nodes.ETSC.name]: "m/44'/1'/0'/0",
  [nodes.MUSIC.name]: "m/44'/1'/0'/0",
  [nodes.GO.name]: "m/44'/1'/0'/0",
  [nodes.EOSC.name]: "m/44'/1'/0'/0",
  [nodes.ESN.name]: "m/44'/1'/0'/0"
};

function getDerivationPath(networkName) {
  if (paths[networkName]) {
    return { dpath: paths[networkName], label: nodes[networkName].name_long };
  }
}

const paths = {};

Object.keys(derivationPaths).forEach(key => {
  paths[derivationPaths[key]] = {
    dpath: paths[key],
    label: nodes[key].name_long
  };
});

export { paths, getDerivationPath };
