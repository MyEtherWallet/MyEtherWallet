import { ENS_MANAGER_ROUTE, ensRouterGuard } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  title: 'ENS Manager',
  subtitle: '',
  description: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: ENS_MANAGER_ROUTE.ENS_MANAGER.PATH,
  name: ENS_MANAGER_ROUTE.ENS_MANAGER.NAME,
  component: () => import('@/dapps/ens-manager-dapp/TheENSManagerLayout'),
  networks: SUPPORTED_NETWORKS,
  layout: () => import('./TheENSManagerLayout'),
  release: '07/08/2021',
  meta: {
    noAuth: false,
    title: 'Register An ENS Domain | Ethereum Name Service',
    description:
      'MyEtherWallet lets you register and set your ENS easily. The Ethereum Name Service makes your address human readable.'
  },
  children: [
    {
      path: ENS_MANAGER_ROUTE.MANAGE.PATH,
      name: ENS_MANAGER_ROUTE.MANAGE.NAME,
      meta: {
        noAuth: false,
        title: 'Manage Your ENS On MyEtherWallet',
        description:
          'Set and renew your ENS on MyEtherWallet. Make receiving crypto easier with a special name for your wallet.'
      }
    },
    {
      path: ENS_MANAGER_ROUTE.REVERSE.PATH,
      name: ENS_MANAGER_ROUTE.REVERSE.NAME,
      meta: {
        noAuth: false,
        title: 'Set Reverse ENS Record | MyEtherWallet',
        description:
          'Allow DApps to recognize your ENS. See your human readable address name in games and DeFi platforms.'
      }
    },
    {
      path: ENS_MANAGER_ROUTE.ENS_1.PATH,
      name: ENS_MANAGER_ROUTE.ENS_1.NAME,
      beforeEnter: ensRouterGuard,
      meta: {
        noAuth: false,
        title: 'Register An ENS Domain | Ethereum Name Service',
        description:
          'MyEtherWallet lets you register and set your ENS easily. The Ethereum Name Service makes your address human readable.'
      }
    },
    {
      path: ENS_MANAGER_ROUTE.ENS_2.PATH,
      name: ENS_MANAGER_ROUTE.ENS_2.NAME,
      beforeEnter: ensRouterGuard,
      meta: {
        noAuth: false,
        title: 'Register An ENS Domain | Ethereum Name Service',
        description:
          'MyEtherWallet lets you register and set your ENS easily. The Ethereum Name Service makes your address human readable.'
      }
    },
    {
      path: ENS_MANAGER_ROUTE.ENS_3.PATH,
      name: ENS_MANAGER_ROUTE.ENS_3.NAME,
      beforeEnter: ensRouterGuard,
      meta: {
        noAuth: false,
        title: 'Register An ENS Domain | Ethereum Name Service',
        description:
          'MyEtherWallet lets you register and set your ENS easily. The Ethereum Name Service makes your address human readable.'
      }
    }
  ]
};
