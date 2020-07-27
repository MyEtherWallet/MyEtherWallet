import app from './app';

import LandingPageView from '@/web/views/LandingPageView';
import Home from '@/web/views/LandingPageView/Home';

import CreateWalletDashboard from '@/web/views/CreateWalletView/CreateWalletDashboard';
import CreateWalletSoftware from '@/web/views/CreateWalletView/Software';
import CreateWalletMewWallet from '@/web/views/CreateWalletView/MewWallet';
import CreateWalletKeystore from '@/web/views/CreateWalletView/KeystoreFile';
import CreateWalletMnemonic from '@/web/views/CreateWalletView/MnemonicPhrase';

import AccessWalletView from '@/web/views/AccessWalletView';
import AccessWalletHardwareWallets from '@/web/views/AccessWalletView/containers/HardwareWallets';

import AccessWalletBrowserExtention from '@/web/views/AccessWalletView/containers/BrowserExtention';
import AccessWalletBrowserExtentionInstall from '@/web/views/AccessWalletView/containers/BrowserExtention/container/InstallExtention';
import AccessWalletBrowserExtentionAccess from '@/web/views/AccessWalletView/containers/BrowserExtention/container/AccessExtention';

import AccessWalletMobileApps from '@/web/views/AccessWalletView/containers/MobileApps';

import AboutUsCompany from '@/web/views/AboutUsView/CompanyContainer';
import AboutUsTeam from '@/web/views/AboutUsView/TeamContainer';

import HowItWorks from '@/web/views/LandingPageView/HowItWorks';
import MoreActions from '@/web/views/LandingPageView/MoreActions';
import BuyHardwareWallet from '@/web/views/LandingPageView/BuyHardwareWallet';

import Wallet from '@/web/views/WalletView';
import Dashboard from '@/web/views/DashboardView';

import Send from '@/web/containers/SendContainer';
import SendTX from '@/web/containers/SendContainer/SendTX';
import SendOffline from '@/web/containers/SendContainer/SendOffline';
import NFTManager from '@/web/containers/SendContainer/NFTManager';

import Swap from '@/web/containers/SwapContainer';

import Dapps from '@/web/containers/DappsContainer';
import DappsCenter from '@/web/containers/DappsContainer/DappsCenter';
import Trending from '@/web/containers/DappsContainer/Trending';
import NewDapps from '@/web/containers/DappsContainer/NewDapps';
import ENSManager from '@/web/containers/DappsContainer/ENSManager';
import MakerDAO from '@/web/containers/DappsContainer/MakerDAO';
import Aave from '@/web/containers/DappsContainer/Aave';
import Ambrpay from '@/web/containers/DappsContainer/Ambrpay';
import UnstoppableDomain from '@/web/containers/DappsContainer/UnstoppableDomain';

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
        path: 'more-actions',
        name: 'MoreActions',
        component: MoreActions,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'buy-hardware-wallet',
        name: 'BuyHardwareWallet',
        component: BuyHardwareWallet,
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
        path: 'create-wallet',
        name: 'HomeCreateWallet',
        component: CreateWalletDashboard,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'create-wallet/software',
        name: 'HomeCreateWalletSoftware',
        component: CreateWalletSoftware,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'create-wallet/mewwallet',
        name: 'HomeCreateWalletMewWallet',
        component: CreateWalletMewWallet,
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
        path: 'create-wallet/mnemonic',
        name: 'HomeCreateWalletMnemonic',
        component: CreateWalletMnemonic,
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
      },
      {
        path: 'access-wallet/hardware',
        name: 'AccessWalletHardwareWallets',
        component: AccessWalletHardwareWallets,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'access-wallet/browser-extention',
        name: 'AccessWalletBrowserExtention',
        component: AccessWalletBrowserExtention,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'access-wallet/browser-extention/install',
        name: 'AccessWalletBrowserExtentionInstall',
        component: AccessWalletBrowserExtentionInstall,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'access-wallet/browser-extention/access',
        name: 'AccessWalletBrowserExtentionAccess',
        component: AccessWalletBrowserExtentionAccess,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'access-wallet/mobile-apps',
        name: 'AccessWalletMobileApps',
        component: AccessWalletMobileApps,
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
        },
        children: [
          {
            path: 'dapps-center',
            name: 'DappsCenter',
            component: DappsCenter,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'trending',
            name: 'Trending',
            component: Trending,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'new-dapps',
            name: 'NewDapps',
            component: NewDapps,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'ens-manager',
            name: 'ENSManager',
            component: ENSManager,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'maker-dao',
            name: 'MakerDAO',
            component: MakerDAO,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'aave',
            name: 'Aave',
            component: Aave,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'ambrpay',
            name: 'Ambrpay',
            component: Ambrpay,
            meta: {
              requiresAuth: false
            }
          },
          {
            path: 'unstoppable-domain',
            name: 'UnstoppableDomain',
            component: UnstoppableDomain,
            meta: {
              requiresAuth: false
            }
          }
        ]
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
