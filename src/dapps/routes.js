import RegisterDomain from '@/dapps/RegisterDomain';
import EnsBidContainer from '@/dapps/RegisterDomain/containers/EnsBidContainer';
import InitialENSStateContainer from '@/dapps/RegisterDomain/containers/InitialENSStateContainer';
import NameForbiddenENSContainer from '@/dapps/RegisterDomain/containers/NameForbiddenENSContainer';
import AlreadyOwnedENSContainer from '@/dapps/RegisterDomain/containers/AlreadyOwnedENSContainer';

import DomainSaleContainer from '@/dapps/DomainSaleContainer';

const routes = {
  registerDomain: {
    path: 'dapps/register-domain',
    component: RegisterDomain,
    props: true,
    children: [
      {
        path: '',
        name: 'ENS initial state',
        component: InitialENSStateContainer,
        props: true
      },
      {
        path: 'auction',
        name: 'Bid on ENS and start auction',
        component: EnsBidContainer,
        props: true
      },
      {
        path: 'bid',
        name: 'Bid on ENS',
        component: EnsBidContainer,
        props: true
      },
      {
        path: 'owned',
        name: 'ENS owned',
        component: AlreadyOwnedENSContainer,
        props: true
      },
      {
        path: 'reveal',
        name: 'Reveal ENS bid',
        component: EnsBidContainer,
        props: true
      },
      {
        path: 'forbidden',
        name: 'ENS forbidden',
        component: NameForbiddenENSContainer,
        props: true
      }
    ]
  },
  domainSale: {
    path: 'dapps/domain-sale',
    name: 'Domain Sale',
    component: DomainSaleContainer,
    props: true
  }
};

export default routes;
