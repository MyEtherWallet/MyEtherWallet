import domainSale from '@/assets/images/icons/domain-sale.svg';
import registerDomain from '@/assets/images/icons/domain.svg';

const dapps = {
  registerDomain: {
    route: '/interface/dapps/register-domain',
    icon: registerDomain,
    title: 'interface.registerEns',
    desc: 'interface.registerENSDescShort'
  },
  domainSale: {
    route: '/interface/dapps/buy-subdomain',
    icon: domainSale,
    title: 'interface.subdomains',
    desc: 'interface.buySubDomains',
    active: true
  }
};

export default dapps;
