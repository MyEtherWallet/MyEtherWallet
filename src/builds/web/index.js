import Home from '@/layouts/Home';
import HowItWorks from '@/layouts/HowItWorks';
import AboutUsCompany from '@/layouts/AboutUs/Company';
import AboutUsTeam from '@/layouts/AboutUs/Team';
import AboutUsWhyMEW from '@/layouts/AboutUs/WhyMEW';

import CreateWalletDashboard from '@/layouts/Home/CreateWallet/CreateWalletDashboard';
import CreateWalletMewConnect from '@/layouts/Home/CreateWallet/MewConnect';
import CreateWalletKeystore from '@/layouts/Home/CreateWallet/KeystoreFile';

import AccessWalletDashboard from '@/layouts/Home/AccessWallet/AccessWalletDashboard';

import app from './app';
const webRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
    path: '/home/create-wallet',
    name: 'HomeCreateWallet',
    component: CreateWalletDashboard,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/home/create-wallet/mewconnect',
    name: 'HomeCreateWalletMewConnect',
    component: CreateWalletMewConnect,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/home/create-wallet/keystore',
    name: 'HomeCreateWalletKeystore',
    component: CreateWalletKeystore,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/home/access-wallet',
    name: 'HomeAccessWallet',
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
