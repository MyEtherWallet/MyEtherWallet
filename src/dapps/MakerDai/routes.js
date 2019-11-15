const MakerDai = () => import('./MakerDai');
const MakerHome = () => import('./containers/MakerHome');
const CreateCDP = () => import('./containers/CreateCDP');
const ManageCDP = () => import('./containers/ManageCDP');
const SelectCDP = () => import('./containers/SelectCDP');
const ProxyMigrateCDP = () => import('./containers/ProxyMigrateCDP');
const migrateDAI = () => import('./containers/MigrateDai');
const migrateCDP = () => import('./containers/MigrateCDP');
const MakerSave = () => import('./containers/MakerSavings');

const MakerLoading = () => import('./containers/MakerLoading');

export default {
  path: 'dapps/maker-dai',
  component: MakerDai,
  props: true,
  children: [
    {
      path: '',
      name: 'Maker',
      component: MakerHome,
      props: true
    },
    {
      path: 'makerLoading',
      name: 'makerLoading',
      component: MakerLoading,
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
      path: 'migrateDAI',
      name: 'migrateDAI',
      component: migrateDAI,
      props: true
    },
    {
      path: 'migrateCDP',
      name: 'migrateCDP',
      component: migrateCDP,
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
    },
    {
      path: 'save',
      name: 'save',
      component: MakerSave,
      props: true
    }
  ]
};
