import { ROUTES_MAIN, ROUTES_SEND } from './routeNames'
const TempView = () => import('@view-default/ViewTemp.vue')
const SendView = () => import('@/views/wallet/send/ViewSend.vue')
const SwapView = () => import('@/views/wallet/swap/ViewSwap.vue')
const ViewCrypto = () => import('@/views/wallet/crypto/ViewCrypto.vue')
const NotFoundView = () => import('@view-default/ViewNotFound.vue')
const ModuleSend = () => import('@/modules/send/ModuleSend.vue')
const ModuleSwap = () => import('@/modules/swap/ModuleSwap.vue')
const ModuleSendNft = () => import('@/modules/nft/ModuleSendNft.vue')

const DefaultRoutes = [
  {
    path: ROUTES_MAIN.HOME.PATH,
    name: ROUTES_MAIN.HOME.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.CRYPTO.PATH,
    name: ROUTES_MAIN.CRYPTO.NAME,
    component: ViewCrypto,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_SEND.SEND.PATH,
    component: SendView,
    children: [
      {
        path: '',
        name: ROUTES_SEND.SEND.NAME,
        component: ModuleSend,
      },
      {
        path: ROUTES_SEND.SEND_NFT.PATH,
        name: ROUTES_SEND.SEND_NFT.NAME,
        component: ModuleSendNft,
      },
    ],
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.SWAP.PATH,
    component: SwapView,
    children: [
      {
        path: '',
        name: ROUTES_MAIN.SWAP.NAME,
        component: ModuleSwap,
      },
    ],
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.BUY.PATH,
    name: ROUTES_MAIN.BUY.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.EARN.PATH,
    name: ROUTES_MAIN.EARN.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.VERIFY_MESSAGE.PATH,
    name: ROUTES_MAIN.VERIFY_MESSAGE.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.SIGN_MESSAGE.PATH,
    name: ROUTES_MAIN.SIGN_MESSAGE.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.INTERACT_WITH_CONTRACT.PATH,
    name: ROUTES_MAIN.INTERACT_WITH_CONTRACT.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.DEPLOY_CONTRACT.PATH,
    name: ROUTES_MAIN.DEPLOY_CONTRACT.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.LEARN.PATH,
    name: ROUTES_MAIN.LEARN.NAME,
    component: TempView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.STOCKS.PATH,
    name: ROUTES_MAIN.STOCKS.NAME,
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
]

export default DefaultRoutes
