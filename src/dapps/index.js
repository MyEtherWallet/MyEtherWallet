import domainSale from '@/assets/images/icons/domain-sale.svg';
import registerDomain from '@/assets/images/icons/domain.svg';
import scheduleTransaction from '@/assets/images/icons/eac.svg';

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
  },
  scheduleTransaction: {
    route: '/interface/dapps/schedule-transaction',
    icon: scheduleTransaction,
    title: 'Schedule a transaction',
    desc:
      'Schedule a transaction on Ethereum for future execution using the decentralized Ethereum Alarm Clock protocol'
  }
};

export default dapps;
