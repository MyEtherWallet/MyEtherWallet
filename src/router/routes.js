import Home from '@/modules/home/Home';
import CompanyPage from '@/modules/company/Company';
import TeamPage from '@/modules/team/Team';
import BuyHardwareWallet from '@/modules/hardware/Hardware';
import ToolsPage from '@/modules/tools/Tools';
import LandingPage from '@/modules/home/pages/landing-page/LandingPage';

import CreateWallet from '@/modules/wallets/pages/create/CreateWallet';

import AccessWalletView from '@/modules/wallets/pages/access/Access';
import AccessWalletHardwareWallets from '@/modules/wallets/pages/access/hardware-wallets/HardwareWallets';
import AccessWalletMobileApps from '@/modules/wallets/pages/access/mobile-apps/MobileApps';
import AccessWalletBrowserExtension from '@/modules/wallets/pages/access/browser-extension/BrowserExtension';

import AccessWalletBrowserExtensionInstall from '@/modules/wallets/components/install-extension/InstallExtension';
import AccessWalletBrowserExtensionAccess from '@/modules/wallets/components/access-extension/AccessExtension';

import HowItWorks from '@/modules/how-it-works/HowItWorks';

import WalletRoutes from '@/modules/wallets/routes.js';

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: LandingPage
      },
      {
        path: 'how-it-works',
        name: 'HowItWorks',
        component: HowItWorks
      },
      {
        path: 'tools',
        name: 'Tools',
        component: ToolsPage
      },
      {
        path: 'buy-hardware-wallet',
        name: 'BuyHardwareWallet',
        component: BuyHardwareWallet
      },
      {
        path: 'company',
        name: 'CompanyPage',
        component: CompanyPage
      },
      {
        path: 'team',
        name: 'TeamPage',
        component: TeamPage
      },
      {
        path: 'create-wallet',
        name: 'CreateWallet',
        component: CreateWallet
      },
      {
        path: 'access-wallet',
        name: 'AccessWallet',
        component: AccessWalletView
      },
      {
        path: 'access-wallet/hardware',
        name: 'AccessWalletHardwareWallets',
        component: AccessWalletHardwareWallets
      },
      {
        path: 'access-wallet/browser-extension',
        name: 'AccessWalletBrowserExtension',
        component: AccessWalletBrowserExtension
      },
      {
        path: 'access-wallet/browser-extension/install',
        name: 'AccessWalletBrowserExtensionInstall',
        component: AccessWalletBrowserExtensionInstall
      },
      {
        path: 'access-wallet/browser-extension/access',
        name: 'AccessWalletBrowserExtensionAccess',
        component: AccessWalletBrowserExtensionAccess
      },
      {
        path: 'access-wallet/mobile-apps',
        name: 'AccessWalletMobileApps',
        component: AccessWalletMobileApps
      }
    ]
  },
  WalletRoutes
];

export default routes;
