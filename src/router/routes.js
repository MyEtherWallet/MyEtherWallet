import Home from '@/modules/home/Home';
import CompanyPage from '@/modules/company/Company';
import TeamPage from '@/modules/team/Team';
import BuyHardwareWallet from '@/modules/hardware/Hardware';
import ToolsPage from '@/modules/tools/Tools';
import LandingPage from '@/modules/home/pages/landing-page/LandingPage';

import CreateWallet from '@/modules/wallets/pages/create/CreateWallet';

import AccessWallet from '@/modules/wallets/pages/access/Access';
// import AccessWalletHardwareWallets from '@/modules/wallets/pages/access/hardware-wallets/HardwareWallets';
// import AccessWalletMobileApps from '@/modules/wallets/pages/access/mobile-apps/MobileApps';
// import AccessWalletBrowserExtension from '@/modules/wallets/pages/access/browser-extension/BrowserExtension';

// import AccessWalletBrowserExtensionInstall from '@/modules/wallets/components/install-extension/InstallExtension';
// import AccessWalletBrowserExtensionAccess from '@/modules/wallets/components/access-extension/AccessExtension';

import HowItWorks from '@/modules/how-it-works/HowItWorks';

import WalletRoutes from '@/modules/wallets/routes.js';

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'Home',
        component: LandingPage,
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
        name: 'Tools',
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
        path: 'company',
        name: 'CompanyPage',
        component: CompanyPage,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'team',
        name: 'TeamPage',
        component: TeamPage,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'wallet/create',
        name: 'CreateWallet',
        component: CreateWallet,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'wallet/access',
        name: 'AccessWallet',
        component: AccessWallet,
        meta: {
          requiresAuth: false
        }
      }
      // {
      //   path: 'access-wallet/hardware',
      //   name: 'AccessWalletHardwareWallets',
      //   component: AccessWalletHardwareWallets,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/browser-extension',
      //   name: 'AccessWalletBrowserExtension',
      //   component: AccessWalletBrowserExtension,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/browser-extension/install',
      //   name: 'AccessWalletBrowserExtensionInstall',
      //   component: AccessWalletBrowserExtensionInstall,
      //   meta: {
      //     requiresAuth: false
      //   }
      // },
      // {
      //   path: 'access-wallet/browser-extension/access',
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
