import app from './app';

import LandingPageView from '@/web/views/LandingPageView';
import Home from '@/web/views/LandingPageView/Home';
import CreateWalletDashboard from '@/web/views/CreateWalletView/CreateWalletDashboard';
import CreateWalletMewConnect from '@/web/views/CreateWalletView/MewConnect';
import CreateWalletKeystore from '@/web/views/CreateWalletView/KeystoreFile';
import AccessWalletView from '@/web/views/AccessWalletView';

import AboutUsCompany from '@/web/views/AboutUsView/CompanyContainer';
import AboutUsTeam from '@/web/views/AboutUsView/TeamContainer';
import AboutUsWhyMEW from '@/web/views/AboutUsView/WhyMEWContainer';

import HowItWorks from '@/web/views/LandingPageView/HowItWorks';

import Wallet from '@/web/views/WalletView';
import Dashboard from '@/web/views/DashboardView';

import Send from '@/web/containers/SendContainer';
import SendTX from '@/web/containers/SendContainer/SendTX';
import SendOffline from '@/web/containers/SendContainer/SendOffline';
import NFTManager from '@/web/containers/SendContainer/NFTManager';

import Swap from '@/web/containers/SwapContainer';
import Dapps from '@/web/containers/DappsContainer';

import Contract from '@/web/containers/ContractContainer';
import DeployContract from '@/web/containers/ContractContainer/DeployContract';
import InteractWithContract from '@/web/containers/ContractContainer/InteractWithContract';

import SignMessage from '@/web/containers/SignMessageContainer';

const webRoutes = [
  {
    path: '/',
    component: LandingPageView,
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
        component: AccessWalletView,
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: Wallet,
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
