import { ROUTES_HOME } from './routeNames';
const LayoutDefault = () => import('@components/core_layouts/LayoutDefault.vue')
const HomeView = () => import('@view-default/ViewAccessWallet.vue')
const TempView = () => import('@view-default/ViewTemp.vue')
const KeystoreUpload = () => import('@/modules/access/access_keystore/KeystoreUpload.vue')
const KeystorePassword = () => import('@/modules/access/access_keystore/KeystorePassword.vue')

const DefaultRoutes = [{
  path: '/',
  component: LayoutDefault,
  props: true,
  children: [
    {
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: HomeView,
      meta: {
        noAuth: true
      },
    },
    {
      path: '/access/keystore',
      name: 'KeystoreAccess',
      component: KeystoreUpload,
      alias: '/access/keystore/upload',
      meta: {
        noAuth: true
      },
    },
    {
      path: '/access/keystore/password',
      name: 'KeystoreAccessPassword',
      component: KeystorePassword,
      meta: {
        noAuth: true
      },
    },
    {
      path: '/wallet',
      children: [
        {
          path: '',
          name: 'WalletDashboardDefault',
          component: TempView,
        },
        {
          path: '/dashboard',
          name: 'WalletDashboard',
          component: TempView,
        },
        {
          path: '/send',
          name: 'WalletSend',
          component: TempView,
        }
      ]
    },
    /** Temporary Paths to be removed on v7 release
     *  Right Now components library thinks these exist in the project
     */
    {
      path: ROUTES_HOME.HOW_IT_WORKS.PATH,
      name: ROUTES_HOME.HOW_IT_WORKS.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.SECURITY_POLICY.PATH,
      name: ROUTES_HOME.SECURITY_POLICY.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PRIVACY_POLICY.PATH,
      name: ROUTES_HOME.PRIVACY_POLICY.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TERMS_OF_SERVICE.PATH,
      name: ROUTES_HOME.TERMS_OF_SERVICE.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TOOLS.PATH,
      name: ROUTES_HOME.TOOLS.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.BUY_HARDWARE_WALLET.PATH,
      name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.ABOUT_PAGE.PATH,
      name: ROUTES_HOME.ABOUT_PAGE.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TEAM_PAGE.PATH,
      name: ROUTES_HOME.TEAM_PAGE.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PRESS_KIT.PATH,
      name: ROUTES_HOME.PRESS_KIT.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CONVERT_UNITS.PATH,
      name: ROUTES_HOME.CONVERT_UNITS.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.JOBS.PATH,
      name: ROUTES_HOME.JOBS.NAME,
      component: TempView,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      name: ROUTES_HOME.CREATE_WALLET.NAME,
      component: TempView,
      meta: {
        noAuth: true
      },

    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: TempView,
      meta: {
        noAuth: true
      },
    },
    {
      path: '/advertise-with-us',
      name: 'advertise-with-us',
      component: TempView,
      meta: {
        noAuth: true
      },
    }


  ]
}]

export default DefaultRoutes

