import domainSale from '@/assets/images/icons/domain-sale.svg';
import domainSaleHov from '@/assets/images/icons/domain-sale-hov.svg';
import registerDomain from '@/assets/images/icons/domain.svg';
import registerDomainHov from '@/assets/images/icons/domain-hov.svg';
import secureTransaction from '@/assets/images/icons/button-key.svg';
import { ETH, GOERLI, ROP, RIN } from '@/networks/types';

const dapps = {
  secureTransaction: {
    route: '/interface/dapps/secure-transaction',
    icon: secureTransaction,
    title: 'SafeSend ETH Transaction',
    desc: 'Protect and Secure your ETH transaction using SafeSend'
  },
  registerDomain: {
    route: '/interface/dapps/register-domain',
    icon: registerDomain,
    iconDisabled: registerDomainHov,
    title: 'interface.registerEns',
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
  }
};

export default dapps;
