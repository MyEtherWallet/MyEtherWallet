import BuySubdomain from './BuySubdomain';

export default {
  path: 'dapps/buy-subdomain',
  name: 'Buy Subdomain',
  component: BuySubdomain,
  props: true,
  meta: { requiresAuth: true }
};
