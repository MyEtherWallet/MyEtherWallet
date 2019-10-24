import HomeLayout from '@/layouts/HomeLayout';

import app from './app';
const webRoutes = [
  {
    path: '/',
    name: 'Home',
    component: HomeLayout,
    meta: { requiresAuth: false }
  }
];
const configRoutes = routes => {
  return routes.concat(webRoutes);
};
export { app, configRoutes };
