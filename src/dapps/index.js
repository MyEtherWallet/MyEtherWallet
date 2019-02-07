import domainSale from '@/assets/images/icons/domain-sale.svg';
import domainSaleHov from '@/assets/images/icons/domain-sale-hov.svg';
import registerDomain from '@/assets/images/icons/domain.svg';
import registerDomainHov from '@/assets/images/icons/domain-hov.svg';

const dapps = {
  registerDomain: {
    route: '/interface/dapps/register-domain',
    icon: registerDomain,
    iconDisabled: registerDomainHov,
    title: 'interface.registerEns',
    desc: 'interface.registerENSDescShort',
    supportedNetworks: ['ETH']
  },
  domainSale: {
    route: '/interface/dapps/buy-subdomain',
    icon: domainSale,
    iconDisabled: domainSaleHov,
    title: 'interface.subdomains',
    desc: 'interface.buySubDomains',
    supportedNetworks: ['ETH']
  }
};

export default dapps;
