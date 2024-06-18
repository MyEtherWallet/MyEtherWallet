import {
  ETC,
  ETH,
  GO,
  XDC,
  ROOTSTOCK,
  ROOTSTOCKTESTNET
} from '@/utils/networks/types';
import {
  ledgerEthereum,
  ledgerLiveEthereum,
  ledgerEthereumClassic,
  ledgerLiveEthereumClassic,
  goChain,
  xdcnetwork,
  rskMainnet,
  rskTestnet
} from '@/modules/access-wallet/hardware/handlers/configs/configPaths';
const appList = [
  {
    network: ETH,
    paths: [ledgerEthereum, ledgerLiveEthereum]
  },
  {
    network: Object.assign({}, ETH, {
      name: 'Eth Recovery',
      name_long: 'Eth Recovery'
    }),
    paths: [ledgerEthereum, ledgerLiveEthereum]
  },
  {
    network: ETC,
    paths: [ledgerEthereumClassic, ledgerLiveEthereumClassic]
  },
  {
    network: GO,
    paths: [goChain]
  },
  {
    network: XDC,
    paths: [xdcnetwork]
  },
  {
    network: ROOTSTOCK,
    paths: [rskMainnet]
  },
  {
    network: ROOTSTOCKTESTNET,
    paths: [rskTestnet]
  }
];
export default appList;
