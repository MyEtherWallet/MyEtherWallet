const MakerDai = () => import('./MakerDai');
const MakerHome = () => import('./containers/MakerHome');
const CreateCDP = () => import('./containers/CreateCDP');
const ManageCDP = () => import('./containers/ManageCDP');
const SelectCDP = () => import('./containers/SelectCDP');
const ProxyMigrateCDP = () => import('./containers/ProxyMigrateCDP');

export default {
  path: 'dapps/maker-sai',
  component: MakerDai,
  props: true,
  children: [
    {
      path: '',
      name: 'Maker-sai',
      component: MakerHome,
      props: true
    },
    {
      path: 'create',
      name: 'create-sai',
      component: CreateCDP,
      props: true
    },
    {
      path: 'select',
      name: 'select-sai',
      component: SelectCDP,
      props: true
    },
    {
      path: 'manage/:cdpId',
      name: 'manage-sai',
      component: ManageCDP,
      props: true
    },
    {
      path: 'migrate/:cdpId',
      name: 'migrate-sai',
      component: ProxyMigrateCDP,
      props: true
    }
  ]
};
