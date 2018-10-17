import * as nodes from '@/networks/types';

const derivationPaths = {
  default: nodes.ETH.name,
  [nodes.ETH.name]: "m/44'/60'/0'",
  [nodes.ETC.name]: "m/44'/60'/160720'/0",
  [nodes.ROP.name]: "m/44'/1'/0'/0",
  [nodes.RIN.name]: "m/44'/1'/0'/0",
  [nodes.KOV.name]: "m/44'/1'/0'/0"
};

export default derivationPaths;
