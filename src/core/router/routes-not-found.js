import { ROUTES_HOME } from '../configs/configRoutes';

export default {
  path: ROUTES_HOME.PAGE_NOT_FOUND.PATH,
  component: () => import('@/views/TheDefaultView'),
  children: [
    {
      path: ROUTES_HOME.PAGE_NOT_FOUND.PATH,
      name: ROUTES_HOME.PAGE_NOT_FOUND.NAME,
      component: () => import('@/views/layouts-default/ThePageNotFoundLayout'),
      meta: {
        noAuth: true,
        title: '404 Page Not Found',
        description: '404 page for MyEtherWallet.'
      }
    }
  ]
};
