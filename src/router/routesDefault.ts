import {
  ROUTES_MAIN,
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
  PERP_INFO_ROUTE_NAME,
} from './routeNames'
import { TOKEN_INFO_ROUTE } from './routeTokenInfo'
import { STOCK_INFO_ROUTE } from './routeStockInfo'
import { PERP_INFO_ROUTE } from './routePerpInfo'
import { ACCESS_ROUTES } from './routesAccess'
import { CREATE_ROUTES } from './routesCreate'
import { type RouterOptions } from 'vue-router'
import { fetchTradingRestriction } from '@/composables/useTradingRestriction'

const TempView = () => import('@/views/ViewTemp.vue')
const SignMessageView = () => import('@/views/ViewSignMessage.vue')
const VerifyMessageView = () => import('@/views/ViewVerifyMessage.vue')
const PortfolioView = () => import('@/views/ViewPortfolio.vue')
const ViewCrypto = () => import('@/views/ViewCrypto.vue')
const NotFoundView = () => import('@/views/ViewNotFound.vue')
const ViewStocks = () => import('@/views/ViewStocks.vue')
const ViewPerps = () => import('@/views/ViewPerps.vue')

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
      CREATE_ROUTES,
      ACCESS_ROUTES,
      {
        name: TOKEN_INFO_ROUTE_NAMES.home,
        ...TOKEN_INFO_ROUTE,
      },
      {
        name: STOCK_INFO_ROUTE_NAMES.home,
        ...STOCK_INFO_ROUTE,
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
      {
        name: STOCK_INFO_ROUTE_NAMES.crypto,
        ...STOCK_INFO_ROUTE,
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
    children: [
      {
        name: TOKEN_INFO_ROUTE_NAMES.earn,
        ...TOKEN_INFO_ROUTE,
      },
      {
        name: STOCK_INFO_ROUTE_NAMES.earn,
        ...STOCK_INFO_ROUTE,
      },
    ],
  },
  {
    path: ROUTES_MAIN.VERIFY_MESSAGE.PATH,
    name: ROUTES_MAIN.VERIFY_MESSAGE.NAME,
    component: VerifyMessageView,
    meta: {
      noAuth: true,
    },
    children: [
      {
        name: TOKEN_INFO_ROUTE_NAMES.verify,
        ...TOKEN_INFO_ROUTE,
      },
      {
        name: STOCK_INFO_ROUTE_NAMES.verify,
        ...STOCK_INFO_ROUTE,
      },
    ],
  },
  {
    path: ROUTES_MAIN.SIGN_MESSAGE.PATH,
    name: ROUTES_MAIN.SIGN_MESSAGE.NAME,
    component: SignMessageView,
    meta: {
      noAuth: true,
    },
    children: [
      {
        name: TOKEN_INFO_ROUTE_NAMES.sign,
        ...TOKEN_INFO_ROUTE,
      },
      {
        name: STOCK_INFO_ROUTE_NAMES.sign,
        ...STOCK_INFO_ROUTE,
      },
    ],
  },
  {
    path: ROUTES_MAIN.PERPS.PATH,
    name: ROUTES_MAIN.PERPS.NAME,
    component: ViewPerps,
    meta: {
      noAuth: true,
    },
    beforeEnter: async (_to, _from, next) => {
      // Perps stays reachable in restricted regions — the view renders a
      // blocked state instead of redirecting away. The geo check is still
      // awaited here so it is resolved before the first paint, otherwise a
      // restricted user would briefly see a tradeable UI.
      await fetchTradingRestriction()
      next()
    },
    children: [
      {
        name: PERP_INFO_ROUTE_NAME,
        ...PERP_INFO_ROUTE,
      },
    ],
  },
  {
    path: ROUTES_MAIN.STOCKS.PATH,
    name: ROUTES_MAIN.STOCKS.NAME,
    component: ViewStocks,
    meta: {
      noAuth: true,
    },
    children: [
      {
        name: STOCK_INFO_ROUTE_NAMES.stocks,
        ...STOCK_INFO_ROUTE,
      },
      {
        name: TOKEN_INFO_ROUTE_NAMES.stocks,
        ...TOKEN_INFO_ROUTE,
      },
    ],
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
