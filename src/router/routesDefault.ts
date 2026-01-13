import { ROUTES_MAIN } from './routeNames'
import { TOKEN_INFO_ROUTE } from './routeTokenInfo'
import { ACCESS_ROUTES } from './routesAccess'
import { TOKEN_INFO_ROUTE_NAMES } from './routeNames'
import { type RouterOptions } from 'vue-router'

const TempView = () => import('@/views/ViewTemp.vue')
const SignMessageView = () => import('@/views/ViewSignMessage.vue')
const VerifyMessageView = () => import('@/views/ViewVerifyMessage.vue')
const PortfolioView = () => import('@/views/ViewPortfolio.vue')
const ViewCrypto = () => import('@/views/ViewCrypto.vue')
const NotFoundView = () => import('@/views/ViewNotFound.vue')

type RouteNameCollection = RouterOptions['routes']
const DefaultRoutes = <RouteNameCollection>[
  {
    path: ROUTES_MAIN.HOME.PATH,
    name: ROUTES_MAIN.HOME.NAME,
    component: PortfolioView,
    meta: {
      noAuth: true,
    },
    children: [
      ACCESS_ROUTES,
      {
        name: TOKEN_INFO_ROUTE_NAMES.home,
        ...TOKEN_INFO_ROUTE,
      },
    ],
  },
  {
    path: ROUTES_MAIN.CRYPTO.PATH,
    name: ROUTES_MAIN.CRYPTO.NAME,
    component: ViewCrypto,
    meta: {
      noAuth: true,
    },
    children: [
      {
        name: TOKEN_INFO_ROUTE_NAMES.crypto,
        ...TOKEN_INFO_ROUTE,
      },
    ],
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
    component: VerifyMessageView,
    meta: {
      noAuth: true,
    },
  },
  {
    path: ROUTES_MAIN.SIGN_MESSAGE.PATH,
    name: ROUTES_MAIN.SIGN_MESSAGE.NAME,
    component: SignMessageView,
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
