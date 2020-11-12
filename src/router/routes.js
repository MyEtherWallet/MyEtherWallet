import Home from '@/modules/home/Home';
import CompanyPage from '@/modules/company/Company';
import TeamPage from '@/modules/team/Team';
import BuyHardwareWallet from '@/modules/hardware/Hardware';
import ToolsPage from '@/modules/tools/Tools';
import LandingPage from '@/modules/home/pages/landing-page/LandingPage';
import CreateWallet from '@/modules/wallets/pages/create/Create';

import AccessWallet from '@/modules/wallets/pages/access/Access';
import HardwareWallets from '@/modules/wallets/pages/access/hardware-wallets/HardwareWallets';
import BrowserExtension from '@/modules/wallets/pages/access/browser-extension/BrowserExtension';
import MobileApps from '@/modules/wallets/pages/access/mobile-apps/MobileApps';

import HowItWorks from '@/modules/how-it-works/HowItWorks';
import WalletRoutes from '@/modules/wallets/routes.js';

const routes = [
  {
    path: '/',
    component: Home,
    props: true,
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
      },
      {
        path: 'wallet/access/hardware-wallets',
        name: 'HardwareWallets',
        component: HardwareWallets,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'wallet/access/browser-extension',
        name: 'BrowserExtension',
        component: BrowserExtension,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'wallet/access/mobile-apps',
        name: 'MobileApps',
        component: MobileApps,
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  WalletRoutes
];

export default routes;
