import dappsmeta from './metainfo-dapps';
import Dapps from '@/modules/dapps-center/ModuleDappsCenter';
export default [
  {
    path: '',
    name: 'Dapps',
    component: Dapps
  },
  ...Object.values(dappsmeta).map(dm => {
    return {
      path: dm.path,
      name: dm.path,
      component: dm.layout
    };
  })
];
