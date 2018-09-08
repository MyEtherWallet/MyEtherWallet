import * as nodes from '../../../networks/types';

const derivationPaths = {
  [nodes.ETH.name]: "m/44'/60'/0'",
  [nodes.ETC.name]: "m/44'/61'/0'/0",
  [nodes.EXP.name]: "m/44'/40'/0'/0",
  [nodes.UBQ.name]: "m/44'/108'/0'/0",
  [nodes.POA.name]: "m/44'/60'/0'/0",
  [nodes.AKA.name]: "m/44'/200625'/0'/0",
  [nodes.PIRL.name]: "m/44'/164'/0'/0",
  [nodes.ETHO.name]: "m/44'/1313114'/0'/0",
  [nodes.ROP.name]: "m/44'/1'/0'/0",
  [nodes.RIN.name]: "m/44'/1'/0'/0",
  [nodes.KOV.name]: "m/44'/1'/0'/0"
};

export default derivationPaths;
