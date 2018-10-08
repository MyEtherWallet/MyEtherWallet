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
    route: '/interface/dapps/domain-sale',
    icon: domainSale,
    title: 'interface.domSale',
    desc: 'interface.domSaleDesc',
    active: true
  }
};

export default dapps;
