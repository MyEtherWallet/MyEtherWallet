const MakerDai = () => import('./MakerDai');
const MakerHome = () => import('./components/MakerHome');
const CreateCDP = () => import('./components/CreateCDP');
const ImportCDP = () => import('./components/ImportCDP');

export default {
  path: 'dapps/maker-dai',
  component: MakerDai,
  props: true,
  meta: { requiresAuth: true },
  children: [
    {
      path: 'dapps/maker-dai',
      name: 'Maker',
      component: MakerHome,
      props: true
    },
    {
      path: 'create',
      name: 'create',
      component: CreateCDP,
      props: true
    },
    {
      path: 'import',
      name: 'import',
      component: ImportCDP,
      props: true
    }
  ]
};
