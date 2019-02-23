import domainSale from '@/assets/images/icons/domain-sale.svg';
import domainSaleHov from '@/assets/images/icons/domain-sale-hov.svg';
import registerDomain from '@/assets/images/icons/domain.svg';
import registerDomainHov from '@/assets/images/icons/domain-hov.svg';
import secureTransaction from '@/assets/images/icons/button-key-hover.svg';
import secureTransactionHov from '@/assets/images/icons/button-key.svg';
import { XDC, ETH, ROP } from '@/networks/types';

const dapps = {
  registerDomain: {
    route: '/interface/dapps/register-domain',
    icon: registerDomain,
    iconDisabled: registerDomainHov,
    title: 'interface.registerEns',
    desc: 'interface.registerENSDescShort',
    supportedNetworks: [ETH.name, ROP.name, XDC.name]
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
  }
};

export default dapps;
