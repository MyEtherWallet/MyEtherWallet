import HomePage from '@/modules/home';
import CompanyPage from '@/modules/company';
import TeamPage from '@/modules/team';
import ToolsPage from '@/modules/tools';

import LandingPageView from '@/views/LandingPageView';

import CreateWallet from '@/modules/wallets/pages/create';

import AccessWalletView from '@/modules/wallets/pages/access';
import AccessWalletHardwareWallets from '@/modules/wallets/pages/access/HardwareWallets';
import AccessWalletMobileApps from '@/modules/wallets/pages/access/MobileApps';
import AccessWalletBrowserExtension from '@/modules/wallets/pages/access/BrowserExtension';

import AccessWalletBrowserExtensionInstall from '@/modules/wallets/components/InstallExtension';
import AccessWalletBrowserExtensionAccess from '@/modules/wallets/components/AccessExtension';

import HowItWorks from '@/views/LandingPageView/HowItWorks';
import BuyHardwareWallet from '@/views/LandingPageView/BuyHardwareWallet';

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
      {
        path: 'create-wallet',
        name: 'HomeCreateWallet',
        component: CreateWallet,
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
        path: 'access-wallet/browser-Extension',
        name: 'AccessWalletBrowserExtension',
        component: AccessWalletBrowserExtension,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'access-wallet/browser-Extension/install',
        name: 'AccessWalletBrowserExtensionInstall',
        component: AccessWalletBrowserExtensionInstall,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'access-wallet/browser-Extension/access',
        name: 'AccessWalletBrowserExtensionAccess',
        component: AccessWalletBrowserExtensionAccess,
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
  WalletRoutes
];

export default routes;
