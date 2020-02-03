import app from './app';

import LandingPages from '@/layouts/LandingPages';
import Home from '@/layouts/LandingPages/Home';
import CreateWalletDashboard from '@/layouts/LandingPages/Home/CreateWallet/CreateWalletDashboard';
import CreateWalletMewConnect from '@/layouts/LandingPages/Home/CreateWallet/MewConnect';
import CreateWalletKeystore from '@/layouts/LandingPages/Home/CreateWallet/KeystoreFile';
import AccessWalletDashboard from '@/layouts/LandingPages/Home/AccessWallet/AccessWalletDashboard';

import AboutUsCompany from '@/layouts/LandingPages/AboutUs/Company';
import AboutUsTeam from '@/layouts/LandingPages/AboutUs/Team';
import AboutUsWhyMEW from '@/layouts/LandingPages/AboutUs/WhyMEW';

import HowItWorks from '@/layouts/LandingPages/HowItWorks';

import Features from '@/layouts/Features';

const webRoutes = [
  {
    path: '/',
    component: LandingPages,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'how-it-works',
        name: 'HowItWorks',
        component: HowItWorks,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'about-us/company',
        name: 'AboutUsCompany',
        component: AboutUsCompany,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'about-us/team',
        name: 'AboutUsTeam',
        component: AboutUsTeam,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'about-us/why-mew',
        name: 'AboutUsWhyMEW',
        component: AboutUsWhyMEW,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'create-wallet',
        name: 'HomeCreateWallet',
        component: CreateWalletDashboard,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'create-wallet/mewconnect',
        name: 'HomeCreateWalletMewConnect',
        component: CreateWalletMewConnect,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'create-wallet/keystore',
        name: 'HomeCreateWalletKeystore',
        component: CreateWalletKeystore,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'access-wallet',
        name: 'HomeAccessWallet',
        component: AccessWalletDashboard,
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: {
      requiresAuth: false
    }
  }
];
const configRoutes = routes => {
  return routes.concat(webRoutes);
};
export { app, configRoutes };
