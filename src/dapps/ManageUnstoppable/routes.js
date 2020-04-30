const ManageUnstoppable = () => import('./ManageUnstoppable');
const InitialManageUnstoppableStateContainer = () =>
  import('./containers/InitialManageUnstoppableStateContainer');
const ManageCryptoContainer = () =>
  import('./containers/ManageCryptoContainer');

export default {
  path: 'dapps/manage-unstoppable',
  component: ManageUnstoppable,
  props: true,
  children: [
    {
      path: '',
      name: 'Manage Unstoppable initial state',
      component: InitialManageUnstoppableStateContainer,
      props: true
    },
    {
      path: 'crypto',
      name: 'Manage Crypto',
      component: ManageCryptoContainer,
      props: true
    }
  ]
};
