import domainSale from '@/assets/images/icons/domain-sale.svg';
import registerDomain from '@/assets/images/icons/domain.svg';

const dapps = {
  registerDomain: {
    route: '/interface/dapps/register-domain',
    icon: registerDomain,
    title: 'interface.registerDom',
    desc: 'interface.registerDomDesc'
  },
  domainSale: {
    route: '/interface/dapps/buy-subdomain',
    icon: domainSale,
    title: 'Subdomains',
    desc: 'Buy a subdomain',
    active: true
  }
};

export default dapps;
