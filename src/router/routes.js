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

import HowItWorks from '@/modules/how-it-works';
import BuyHardwareWallet from '@/views/LandingPageView/BuyHardwareWallet';

// import Wallet from '@/views/WalletView';
// import Dashboard from '@/views/DashboardView';

// import Send from '@/containers/SendContainer';
// import SendTX from '@/containers/SendContainer/SendTX';
// import SendOffline from '@/containers/SendContainer/SendOffline';
// import NFTManager from '@/containers/SendContainer/NFTManager';

// import Swap from '@/containers/SwapContainer';

// import Dapps from '@/containers/DappsContainer';
// import DappsCenter from '@/containers/DappsContainer/DappsCenter';
// import Trending from '@/containers/DappsContainer/Trending';
// import NewDapps from '@/containers/DappsContainer/NewDapps';
// import ENSManager from '@/containers/DappsContainer/ENSManager';
// import MakerDAO from '@/containers/DappsContainer/MakerDAO';
// import Aave from '@/containers/DappsContainer/Aave';
// import Ambrpay from '@/containers/DappsContainer/Ambrpay';
// import UnstoppableDomain from '@/containers/DappsContainer/UnstoppableDomain';

// import Contract from '@/containers/ContractContainer';
// import DeployContract from '@/containers/ContractContainer/DeployContract';
// import InteractWithContract from '@/containers/ContractContainer/InteractWithContract';

// import SignMessage from '@/containers/SignMessageContainer';
import WalletRoutes from '@/modules/wallets/routes.js';

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
  WalletRoutes
];

export default routes;
