import RegisterDomain from './RegisterDomain';
import EnsBidContainer from './containers/EnsBidContainer';
import InitialENSStateContainer from './containers/InitialENSStateContainer';
import NameForbiddenENSContainer from './containers/NameForbiddenENSContainer';
import AlreadyOwnedENSContainer from './containers/AlreadyOwnedENSContainer';
export default {
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
};
