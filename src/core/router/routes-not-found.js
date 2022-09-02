const TheDefaultView = () => import('@/views/TheDefaultView');
const ThePageNotFoundLayout = () =>
  import('@/views/layouts-default/ThePageNotFoundLayout');
import { ROUTES_HOME } from '../configs/configRoutes';

export default {
  path: ROUTES_HOME.PAGE_NOT_FOUND.PATH,
  component: TheDefaultView,
  children: [
    {
      path: ROUTES_HOME.PAGE_NOT_FOUND.PATH,
      name: ROUTES_HOME.PAGE_NOT_FOUND.NAME,
      component: ThePageNotFoundLayout,
      meta: {
        noAuth: true
      }
    }
  ]
};
