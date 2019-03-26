const MakerDai = () => import('./MakerDai');
const MakerHome = () => import('./components/MakerHome');
const CreateCDP = () => import('./components/CreateCDP');
const ManageCDP = () => import('./components/ManageCDP');
const SelectCDP = () => import('./components/SelectCDP');
const ProxyMigrateCDP = () => import('./components/ProxyMigrateCDP');

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
      name: 'create',
      component: CreateCDP,
      props: true
    },
    {
      path: 'select',
      name: 'select',
      component: SelectCDP,
      props: true
    },
    {
      path: 'manage/:cdpId',
      name: 'manage',
      component: ManageCDP,
      props: true
    },
    {
      path: 'migrate/:cdpId',
      name: 'migrate',
      component: ProxyMigrateCDP,
      props: true
    }
  ]
};
