wimport HomePage from '@/modules/home/Home';
import CompanyPage from '@/modules/company/Company';
import TeamPage from '@/modules/team/Team';
import BuyHardwareWallet from '@/modules/hardware/Hardware';
import ToolsPage from '@/modules/tools/Tools';

import Navigation from '@/modules/home/pages/navigation/Navigation';

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
    component: Navigation,
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage
      },
      {
        path: 'how-it-works',
        name: 'HowItWorks',
        component: HowItWorks
      },
      {
        path: 'tools',
        name: 'tools',
        component: ToolsPage
      },
      {
        path: 'buy-hardware-wallet',
        name: 'BuyHardwareWallet',
        component: BuyHardwareWallet
      },
      {
        path: 'about-us/company',
        name: 'CompanyPage',
        component: CompanyPage
      },
      {
        path: 'about-us/team',
        name: 'TeamPage',
        component: TeamPage
      },
      {
        path: 'create-wallet',
        name: 'HomeCreateWallet',
        component: CreateWallet
      },
      {
        path: 'access-wallet',
        name: 'HomeAccessWallet',
        component: AccessWalletView
      },
      {
        path: 'access-wallet/hardware',
        name: 'AccessWalletHardwareWallets',
        component: AccessWalletHardwareWallets
      },
      {
        path: 'access-wallet/browser-Extension',
        name: 'AccessWalletBrowserExtension',
        component: AccessWalletBrowserExtension
      },
      {
        path: 'access-wallet/browser-Extension/install',
        name: 'AccessWalletBrowserExtensionInstall',
        component: AccessWalletBrowserExtensionInstall
      },
      {
        path: 'access-wallet/browser-Extension/access',
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
