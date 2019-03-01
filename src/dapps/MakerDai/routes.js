const MakerDai = () => import('./MakerDai');
const MakerHome = () => import('./components/MakerHome');
const CreateCDP = () => import('./components/CreateCDP');

export default {
  path: 'dapps/maker-dai',
  component: MakerDai,
  props: true,
  meta: { requiresAuth: true },
  children: [
    {
      path: '',
      name: 'Maker',
      component: MakerHome,
      props: true
    },
    {
      path: 'create',
      name: 'Create CDP',
      component: CreateCDP,
      props: true
    }
  ]
};
