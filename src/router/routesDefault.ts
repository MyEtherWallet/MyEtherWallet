import { ROUTES_HOME, ACCESS_ALIAS, KEYSTORE_ALIAS } from './routeNames';
const LayoutDefault = () => import('@components/core_layouts/LayoutDefault.vue')
const ViewHome = () => import('@view-default/ViewAccessWallet.vue')
const TempView = () => import('@view-default/ViewTemp.vue')
const ViewAccessKeystore = () => import('@view-default/ViewAccessKeystore.vue')
const ViewAccessPrivateKey = () => import('@view-default/ViewAccessPrivateKey.vue')
const NotFoundView = () => import('@view-default/ViewNotFound.vue')
const ViewAccessMnemonic = () => import('@view-default/ViewAccessMnemonic.vue')
const DefaultRoutes = [{
  path: '/',
  component: LayoutDefault,
  props: true,
  children: [
    {
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: ViewHome,
      alias: [ACCESS_ALIAS.access, ACCESS_ALIAS.walletAccess],
      meta: {
        noAuth: true
      },
    },
    {
      path: ROUTES_HOME.ACCESS_KEYSTORE.PATH,
      name: ROUTES_HOME.ACCESS_KEYSTORE.NAME,
      component: ViewAccessKeystore,
      alias: KEYSTORE_ALIAS.upload,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.ACCESS_MNEMONIC.PATH,
      name: ROUTES_HOME.ACCESS_MNEMONIC.NAME,
      component: ViewAccessMnemonic,
      alias: KEYSTORE_ALIAS.upload,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.ACCESS_PRIVATE_KEY.PATH,
      name: ROUTES_HOME.ACCESS_PRIVATE_KEY.NAME,
      component: ViewAccessPrivateKey,
      meta: {
        noAuth: true
      }
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
      path: ROUTES_HOME.SECURITY_POLICY.PATH,
      name: ROUTES_HOME.SECURITY_POLICY.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.PRIVACY_POLICY.PATH,
      name: ROUTES_HOME.PRIVACY_POLICY.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.TERMS_OF_SERVICE.PATH,
      name: ROUTES_HOME.TERMS_OF_SERVICE.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.TOOLS.PATH,
      name: ROUTES_HOME.TOOLS.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.BUY_HARDWARE_WALLET.PATH,
      name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.ABOUT_PAGE.PATH,
      name: ROUTES_HOME.ABOUT_PAGE.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.TEAM_PAGE.PATH,
      name: ROUTES_HOME.TEAM_PAGE.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.PRESS_KIT.PATH,
      name: ROUTES_HOME.PRESS_KIT.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.CONVERT_UNITS.PATH,
      name: ROUTES_HOME.CONVERT_UNITS.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.JOBS.PATH,
      name: ROUTES_HOME.JOBS.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      name: ROUTES_HOME.CREATE_WALLET.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: '/advertise-with-us',
      name: 'advertise-with-us',
      component: TempView,
      meta: {
        noAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        noAuth: true,
      },
    },
  ],
},
]

export default DefaultRoutes
