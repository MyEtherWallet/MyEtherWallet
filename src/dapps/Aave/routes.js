import Aave from './Aave';
import HomeContainer from './containers/HomeContainer';
import ActionContainer from './containers/ActionContainer';

export default {
  path: 'dapps/aave',
  component: Aave,
  props: true,
  children: [
    {
      path: '',
      name: 'Home',
      component: HomeContainer,
      props: true
    },
    {
      path: 'action',
      name: 'Action',
      component: ActionContainer,
      props: true
    }
  ]
};
