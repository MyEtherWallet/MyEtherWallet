import HomeLayout from '@/layouts/HomeLayout';
import HowItWorks from '@/layouts/HowItWorks';
import AboutUsCompany from '@/layouts/AboutUs/Company';
import AboutUsTeam from '@/layouts/AboutUs/Team';
import AboutUsWhyMEW from '@/layouts/AboutUs/WhyMEW';

import app from './app';
const webRoutes = [
  {
    path: '/',
    name: 'Home',
    component: HomeLayout,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/how-it-works',
    name: 'HowItWorks',
    component: HowItWorks,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/about-us/company',
    name: 'AboutUsCompany',
    component: AboutUsCompany,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/about-us/team',
    name: 'AboutUsTeam',
    component: AboutUsTeam,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/about-us/why-mew',
    name: 'AboutUsWhyMEW',
    component: AboutUsWhyMEW,
    meta: {
      requiresAuth: false
    }
  }
];
const configRoutes = routes => {
  return routes.concat(webRoutes);
};
export { app, configRoutes };
