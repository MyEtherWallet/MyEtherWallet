import {
  ROUTES_ACCESS,
  KEYSTORE_ALIAS,
  LEDGER_ALIAS,
  TREZOR_ALIAS,
} from './routeNames'
import { beforeAccessEnter } from './helpers/helpersAccess'
const ViewAccessWallet = () => import('@view-default/ViewAccessWallet.vue')
const ViewAccessKeystore = () => import('@view-default/ViewAccessKeystore.vue')
const ViewAccessPrivateKey = () =>
  import('@view-default/ViewAccessPrivateKey.vue')
const ViewAccessMnemonic = () => import('@view-default/ViewAccessMnemonic.vue')
const ViewAccessHardware = () => import('@view-default/ViewAccessHardware.vue')

export const ACCESS_ROUTES = {
  path: ROUTES_ACCESS.ACCESS.PATH,
  props: true,
  beforeEnter: beforeAccessEnter,
  children: [
    {
      path: '',
      name: ROUTES_ACCESS.ACCESS.NAME,
      component: ViewAccessWallet,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_ACCESS.ACCESS_KEYSTORE.PATH,
      name: ROUTES_ACCESS.ACCESS_KEYSTORE.NAME,
      component: ViewAccessKeystore,
      alias: KEYSTORE_ALIAS.upload,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_ACCESS.ACCESS_MNEMONIC.PATH,
      name: ROUTES_ACCESS.ACCESS_MNEMONIC.NAME,
      component: ViewAccessMnemonic,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_ACCESS.ACCESS_PRIVATE_KEY.PATH,
      name: ROUTES_ACCESS.ACCESS_PRIVATE_KEY.NAME,
      component: ViewAccessPrivateKey,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_ACCESS.ACCESS_TREZOR.PATH,
      name: ROUTES_ACCESS.ACCESS_TREZOR.NAME,
      component: ViewAccessHardware,
      alias: TREZOR_ALIAS.access,
      meta: {
        noAuth: true,
      },
    },
    {
      path: ROUTES_ACCESS.ACCESS_LEDGER.PATH,
      name: ROUTES_ACCESS.ACCESS_LEDGER.NAME,
      component: ViewAccessHardware,
      alias: LEDGER_ALIAS.access,
      meta: {
        noAuth: true,
      },
    },
  ],
}
