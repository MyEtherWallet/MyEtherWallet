import HomePage from '@/modules/home';
import CompanyPage from '@/modules/company';
import TeamPage from '@/modules/team';
import ToolsPage from '@/modules/tools';

import LandingPageView from '@/views/LandingPageView';

// import CreateWallet from '@/modules/wallets/components/create';

// import AccessWalletView from '@/views/AccessWalletView';
// import AccessWalletHardwareWallets from '@/views/AccessWalletView/containers/HardwareWallets';

// import AccessWalletBrowserExtension from '@/views/AccessWalletView/containers/BrowserExtension';
// import AccessWalletBrowserExtensionInstall from '@/views/AccessWalletView/containers/BrowserExtension/container/InstallExtension';
// import AccessWalletBrowserExtensionAccess from '@/views/AccessWalletView/containers/BrowserExtension/container/AccessExtension';

// import AccessWalletMobileApps from '@/views/AccessWalletView/containers/MobileApps';

import HowItWorks from '@/views/LandingPageView/HowItWorks';
import BuyHardwareWallet from '@/views/LandingPageView/BuyHardwareWallet';

// import Wallet from '@/views/WalletView';
// import Dashboard from '@/views/DashboardView';

// import Send from '@/containers/SendContainer';
// import SendTX from '@/containers/SendContainer/SendTX';
// import SendOffline from '@/containers/SendContainer/SendOffline';
// import NFTManager from '@/containers/SendContainer/NFTManager';

import Swap from '@/containers/SwapContainer';

// import Dapps from '@/containers/DappsContainer';
// import DappsCenter from '@/containers/DappsContainer/DappsCenter';
// import Trending from '@/containers/DappsContainer/Trending';
// import NewDapps from '@/containers/DappsContainer/NewDapps';
// import ENSManager from '@/containers/DappsContainer/ENSManager';
// import MakerDAO from '@/containers/DappsContainer/MakerDAO';
// import Aave from '@/containers/DappsContainer/Aave';
// import Ambrpay from '@/containers/DappsContainer/Ambrpay';
// import UnstoppableDomain from '@/containers/DappsContainer/UnstoppableDomain';

import Contract from '@/containers/ContractContainer';
import DeployContract from '@/containers/ContractContainer/DeployContract';
import InteractWithContract from '@/containers/ContractContainer/InteractWithContract';

import SignMessage from '@/containers/SignMessageContainer';

const routes = [
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
        component: HomePage,
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
        path: 'tools',
        name: 'tools',
        component: ToolsPage,
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
        name: 'CompanyPage',
        component: CompanyPage,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'about-us/team',
        name: 'TeamPage',
        component: TeamPage,
        meta: {
          requiresAuth: false
        }
      },
      // {
      //   path: 'create-wallet',
      //   name: 'HomeCreateWallet',
      //   component: CreateWallet,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet',
      //   name: 'HomeAccessWallet',
      //   component: AccessWalletView,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/hardware',
      //   name: 'AccessWalletHardwareWallets',
      //   component: AccessWalletHardwareWallets,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/browser-Extension',
      //   name: 'AccessWalletBrowserExtension',
      //   component: AccessWalletBrowserExtension,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/browser-Extension/install',
      //   name: 'AccessWalletBrowserExtensionInstall',
      //   component: AccessWalletBrowserExtensionInstall,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/browser-Extension/access',
      //   name: 'AccessWalletBrowserExtensionAccess',
      //   component: AccessWalletBrowserExtensionAccess,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/mobile-apps',
      //   name: 'AccessWalletMobileApps',
      //   component: AccessWalletMobileApps,
      //   meta: {
      //     requiresAuth: false
      //   }
      // }
    ]
  },
  // {
  //   path: '/wallet',
  //   name: 'Wallet',
  //   component: Wallet,
  //   meta: {
  //     requiresAuth: false
  //   },
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'Dashboard',
  //       component: Dashboard,
  //       meta: {
  //         requiresAuth: false
  //       }
  //     },
      // {
      //   path: 'send',
      //   name: 'Send',
      //   component: Send,
      //   meta: {
      //     requiresAuth: false
      //   },
      //   children: [
      //     {
      //       path: 'sendtx',
      //       name: 'SendTX',
      //       component: SendTX,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'send-offline',
      //       name: 'SendOffline',
      //       component: SendOffline,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'nft-manager',
      //       name: 'NFTManager',
      //       component: NFTManager,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     }
      //   ]
      // }
      // {
      //   path: 'swap',
      //   name: 'Swap',
      //   component: Swap,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'dapps',
      //   name: 'Dapps',
      //   component: Dapps,
      //   meta: {
      //     requiresAuth: false
      //   },
      //   children: [
      //     {
      //       path: 'dapps-center',
      //       name: 'DappsCenter',
      //       component: DappsCenter,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'trending',
      //       name: 'Trending',
      //       component: Trending,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'new-dapps',
      //       name: 'NewDapps',
      //       component: NewDapps,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'ens-manager',
      //       name: 'ENSManager',
      //       component: ENSManager,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'maker-dao',
      //       name: 'MakerDAO',
      //       component: MakerDAO,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'aave',
      //       name: 'Aave',
      //       component: Aave,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'ambrpay',
      //       name: 'Ambrpay',
      //       component: Ambrpay,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     },
      //     {
      //       path: 'unstoppable-domain',
      //       name: 'UnstoppableDomain',
      //       component: UnstoppableDomain,
      //       meta: {
      //         requiresAuth: false
      //       }
      //     }
      //   ]
      // },
  //     {
  //       path: 'contract',
  //       name: 'Contract',
  //       component: Contract,
  //       meta: {
  //         requiresAuth: false
  //       },
  //       children: [
  //         {
  //           path: 'deploy',
  //           name: 'DeployContract',
  //           component: DeployContract,
  //           meta: {
  //             requiresAuth: false
  //           }
  //         },
  //         {
  //           path: 'interact',
  //           name: 'InteractWithContract',
  //           component: InteractWithContract,
  //           meta: {
  //             requiresAuth: false
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'sign',
  //       name: 'SignMessage',
  //       component: SignMessage,
  //       meta: {
  //         requiresAuth: false
  //       }
  //     }
  //   ]
  // }
];

export default routes;
