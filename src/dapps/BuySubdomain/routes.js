const BuySubdomain = () => import('./BuySubdomain');

export default {
  path: 'dapps/name-wallet',
  name: 'Buy Subdomain',
  component: BuySubdomain,
  props: true,
  meta: { requiresAuth: true }
};
