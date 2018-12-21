import domainSale from '@/assets/images/icons/domain-sale.svg';
import registerDomain from '@/assets/images/icons/domain.svg';
import secureTransaction from '@/assets/images/icons/button-key.svg';

const dapps = {
  SecureTransaction: {
    route: '/interface/dapps/secure-transaction',
    icon: secureTransaction,
    title: 'SafeSend ETH Transaction',
    desc: 'Protect and Secure your ETH transaction using SafeSend'
  },
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
