import domainSale from '@/assets/images/icons/domain-sale.svg';
import domainSaleHov from '@/assets/images/icons/domain-sale-hov.svg';
import manageEns from '@/assets/images/icons/domain.svg';
import manageEnsHov from '@/assets/images/icons/domain-hov.svg';
import secureTransactionHov from '@/assets/images/icons/button-key.svg';
import scheduleTransaction from '@/assets/images/icons/eac.svg';
import scheduleTransactionHov from '@/assets/images/icons/eac-hov.svg';
import makerdai from '@/assets/images/icons/dapps/makerdai.svg';
import { ETH, GöETH, ROP, RIN, KOV } from '@/networks/types';

const dapps = {
  manageEns: {
    route: '/interface/dapps/manage-ens',
    icon: manageEns,
    iconDisabled: manageEnsHov,
    title: 'interface.ensManager',
    desc: 'interface.registerENSDescShort',
    supportedNetworks: [ETH.name, GöETH.name, ROP.name, RIN.name]
  },
  domainSale: {
    route: '/interface/dapps/name-wallet',
    icon: domainSale,
    iconDisabled: domainSaleHov,
    title: 'interface.nameYourWallet',
    desc: 'interface.nameYourWalletDesc',
    supportedNetworks: [ETH.name]
  },
  scheduleTransaction: {
    route: '/interface/dapps/schedule-transaction',
    icon: scheduleTransaction,
    iconDisabled: scheduleTransactionHov,
    title: 'Schedule a transaction',
    desc:
      'Schedule a transaction using the decentralized Ethereum Alarm Clock protocol',
    supportedNetworks: [ETH.name, KOV.name]
  },
  maker: {
    route: '/interface/dapps/maker-dai',
    icon: makerdai,
    iconDisabled: secureTransactionHov,
    title: 'dappsMaker.maker_title',
    desc: 'dappsMaker.maker_desc',
    supportedNetworks: [ETH.name, KOV.name]
  }
};

export default dapps;
