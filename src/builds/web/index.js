import HomeLayout from '@/layouts/HomeLayout';
import HowItWorks from '@/layouts/HowItWorks';
import AboutUsCompany from '@/layouts/AboutUs/Company';
import AboutUsTeam from '@/layouts/AboutUs/Team';
import AboutUsWhyMEW from '@/layouts/AboutUs/WhyMEW';

import CreateWalletDashboard from '@/layouts/CreateWallet/CreateWalletDashboard';
import CreateWalletMewConnect from '@/layouts/CreateWallet/MewConnect';
import CreateWalletKeystore from '@/layouts/CreateWallet/KeystoreFile';

import AccessWalletDashboard from '@/layouts/AccessWallet/AccessWalletDashboard';

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
  },
  {
    path: '/create-wallet',
    name: 'CreateWallet',
    component: CreateWalletDashboard,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/create-wallet/mewconnect',
    name: 'CreateWalletMewConnect',
    component: CreateWalletMewConnect,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/create-wallet/keystore',
    name: 'CreateWalletKeystore',
    component: CreateWalletKeystore,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/access-wallet',
    name: 'AccessWallet',
    component: AccessWalletDashboard,
    meta: {
      requiresAuth: false
    }
  }
];
const configRoutes = routes => {
  return routes.concat(webRoutes);
};
export { app, configRoutes };
