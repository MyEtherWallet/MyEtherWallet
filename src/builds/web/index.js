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
import Dashboard from '@/Features/Dashboard';

import Send from '@/Features/Send';
import SendTX from '@/Features/Send/SendTX';
import SendOffline from '@/Features/Send/SendOffline';
import NFTManager from '@/Features/Send/NFTManager';

import Swap from '@/Features/Swap';
import Dapps from '@/Features/Dapps';

import Contract from '@/Features/Contract';
import DeployContract from '@/Features/Contract/DeployContract';
import InteractWithContract from '@/Features/Contract/InteractWithContract';

import SignMessage from '@/Features/SignMessage';

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
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'send',
        name: 'Send',
        component: Send,
        meta: {
          requiresAuth: false
        },
        children: [
          {
            path: 'sendtx',
            name: 'SendTX',
            component: SendTX,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'send-offline',
            name: 'SendOffline',
            component: SendOffline,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'nft-manager',
            name: 'NFTManager',
            component: NFTManager,
            meta: {
              requiresAuth: false
            }
          }
        ]
      },
      {
        path: 'swap',
        name: 'Swap',
        component: Swap,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'dapps',
        name: 'Dapps',
        component: Dapps,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'contract',
        name: 'Contract',
        component: Contract,
        meta: {
          requiresAuth: false
        },
        children: [
          {
            path: 'deploy',
            name: 'DeployContract',
            component: DeployContract,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'interact',
            name: 'InteractWithContract',
            component: InteractWithContract,
            meta: {
              requiresAuth: false
            }
          }
        ]
      },
      {
        path: 'sign',
        name: 'SignMessage',
        component: SignMessage,
        meta: {
          requiresAuth: false
        }
      }
    ]
  }
];
const configRoutes = routes => {
  return routes.concat(webRoutes);
};
export { app, configRoutes };
