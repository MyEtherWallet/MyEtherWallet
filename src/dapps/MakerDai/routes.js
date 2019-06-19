const MakerDai = () => import('./MakerDai');
const MakerHome = () => import('./containers/MakerHome');
const CreateCDP = () => import('./containers/CreateCDP');
const ManageCDP = () => import('./containers/ManageCDP');
const SelectCDP = () => import('./containers/SelectCDP');
const ProxyMigrateCDP = () => import('./containers/ProxyMigrateCDP');

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
