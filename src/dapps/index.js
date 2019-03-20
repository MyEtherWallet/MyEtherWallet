import domainSale from '@/assets/images/icons/domain-sale.svg';
import domainSaleHov from '@/assets/images/icons/domain-sale-hov.svg';
import manageEns from '@/assets/images/icons/domain.svg';
import manageEnsHov from '@/assets/images/icons/domain-hov.svg';
import secureTransaction from '@/assets/images/icons/button-key-hover.svg';
import secureTransactionHov from '@/assets/images/icons/button-key.svg';
import scheduleTransaction from '@/assets/images/icons/eac.svg';
import scheduleTransactionHov from '@/assets/images/icons/eac-hov.svg';
import { ETH, GOERLI, ROP, RIN, KOV } from '@/networks/types';

const dapps = {
  manageEns: {
    route: '/interface/dapps/manage-ens',
    icon: manageEns,
    iconDisabled: manageEnsHov,
    title: 'interface.ensManager',
    desc: 'interface.registerENSDescShort',
    supportedNetworks: [ETH.name, GOERLI.name, ROP.name, RIN.name]
  },
  domainSale: {
    route: '/interface/dapps/buy-subdomain',
    icon: domainSale,
    iconDisabled: domainSaleHov,
    title: 'interface.subdomains',
    desc: 'interface.buySubDomains',
    supportedNetworks: [ETH.name]
  },
  secureTransaction: {
    route: '/interface/dapps/secure-transaction',
    icon: secureTransaction,
    iconDisabled: secureTransactionHov,
    title: 'dapps.safesend_title',
    desc: 'dapps.safesend_desc',
    supportedNetworks: [ETH.name]
  },
  scheduleTransaction: {
    route: '/interface/dapps/schedule-transaction',
    icon: scheduleTransaction,
    iconDisabled: scheduleTransactionHov,
    title: 'Schedule a transaction',
    desc:
      'Schedule a transaction using the decentralized Ethereum Alarm Clock protocol',
    supportedNetworks: [ETH.name, ROP.name, KOV.name]
  }
};

export default dapps;
