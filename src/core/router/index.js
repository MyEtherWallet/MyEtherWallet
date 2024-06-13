import Router from 'vue-router';
import Vue from 'vue';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';
import langShortCodes from '@/translations/getShortCodes';
import routesDefault from './routes-default';
import routesOfflineDefault from './routes-offline-default';
import routesOfflineWallet from './routes-offline-wallet';
import routesWallet from './routes-wallet';
import routesNotFound from './routes-not-found';
import { ROUTES_HOME } from '../configs/configRoutes';

const routes =
  // eslint-disable-next-line
  BUILD === 'offline'
    ? [routesOfflineDefault, routesOfflineWallet, routesNotFound]
    : [routesDefault, routesWallet, routesNotFound];

const getLangBasePath = () => {
  if (ROUTER_MODE === 'hash') return undefined;
  const locale = window.location.pathname.replace(/^\/([^/]+).*/i, '$1').trim();
  if (Object.keys(langShortCodes).includes(locale)) return '/' + locale;
  return undefined;
};
const router = new Router({
  base: getLangBasePath(),
  mode: ROUTER_MODE || 'hash',
  routes: routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    window.scrollTo(0, 0);
  }
});
router.beforeResolve((to, from, next) => {
  const { setLastPath, path } = useExternalStore();
  const { removeWallet, address } = useWalletStore();
  // Check if user is coming from a path that needs auth
  if (!from.meta.noAuth && address.value && to.meta.noAuth) {
    removeWallet();
  }
  if (to.meta.noAuth) {
    next();
  } else {
    if (address.value === null) {
      setLastPath(to.path);
      next({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
    } else {
      if (path.value !== '') {
        const localPath = path.value;
        if (window.navigator.onLine) {
          Vue.prototype.$amplitude.track('WalletDirectLinkAccess', {
            to: localPath
          });
        }
        setLastPath('');
        router.push({ path: localPath });
      } else {
        next();
      }
    }
  }
});
router.afterEach(to => {
  const defaultTitle = 'MyEtherWallet | The Best Crypto Wallet For Web3';
  const defaultDescription =
    'Trusted by millions of users, MyEtherWallet is the first and best open source Ethereum wallet. Create a secure crypto wallet, buy, sell, stake and swap.';
  const desc = document.querySelector('head meta[name="description"]');
  const ogDesc = document.querySelector('head meta[property="og:description"]');
  const title = document.querySelector('head title');
  const ogTitle = document.querySelector('head meta[property="og:title"]');

  if (to.meta) {
    title.textContent = to.meta.hasOwnProperty('title')
      ? to.meta.title
      : defaultTitle;
    ogTitle.setAttribute(
      'content',
      to.meta.hasOwnProperty('title') ? to.meta.title : defaultTitle
    );
    desc.setAttribute(
      'content',
      to.meta.hasOwnProperty('description')
        ? to.meta.description
        : defaultDescription
    );
    ogDesc.setAttribute(
      'content',
      to.meta.hasOwnProperty('description')
        ? to.meta.description
        : defaultDescription
    );
  }
});

export default router;
