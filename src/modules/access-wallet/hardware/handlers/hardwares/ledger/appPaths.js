import { ETC, ETH, ROP } from '@/utils/networks/types';
import {
  ledgerEthereum,
  ledgerLiveEthereum,
  ledgerEthereumClassic,
  ledgerLiveEthereumClassic,
  ropsten
} from '@/modules/access-wallet/hardware/handlers/configs/configPaths';
const appList = [
  {
    network: ETH,
    paths: [ledgerEthereum, ledgerLiveEthereum]
  },
  {
    network: ETC,
    paths: [ledgerEthereumClassic, ledgerLiveEthereumClassic]
  },
  {
    network: ROP,
    paths: [ropsten]
  }
];
export default appList;
