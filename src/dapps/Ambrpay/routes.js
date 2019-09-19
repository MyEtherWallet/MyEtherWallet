const Ambrpay = () => import('./Ambrpay');

export default {
  path: 'dapps/ambrpay',
  name: 'Ambrpay',
  component: Ambrpay,
  props: true,
  meta: { requiresAuth: true }
};
