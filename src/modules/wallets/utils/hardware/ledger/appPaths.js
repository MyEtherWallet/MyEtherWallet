import { ETC, ETH, ROP } from '@/utils/networks/types';
import {
  ledgerEthereum,
  ledgerLiveEthereum,
  ledgerEthereumClassic,
  ledgerLiveEthereumClassic,
  ropsten
} from '../../bip44/paths';
const appList = [
  {
    network: ETH,
    prefixes: ["m/44'/60'"],
    paths: [ledgerEthereum, ledgerLiveEthereum]
  },
  {
    network: ETC,
    prefixes: ["m/44'/61'", "m/44'/60'"],
    paths: [ledgerEthereumClassic, ledgerLiveEthereumClassic]
  },
  {
    network: ROP,
    prefixes: ["m/44'/1'"],
    paths: [ropsten]
  }
];
export default appList;
