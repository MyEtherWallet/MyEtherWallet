import HomePage from '@/modules/home';
import CompanyPage from '@/modules/company';
import TeamPage from '@/modules/team';
import ToolsPage from '@/modules/tools';

import Navigation from '@/modules/home/pages/navigation';

import CreateWallet from '@/modules/wallets/pages/create';

import AccessWalletView from '@/modules/wallets/pages/access';
import AccessWalletHardwareWallets from '@/modules/wallets/pages/access/HardwareWallets';
import AccessWalletMobileApps from '@/modules/wallets/pages/access/MobileApps';
import AccessWalletBrowserExtension from '@/modules/wallets/pages/access/BrowserExtension';

import AccessWalletBrowserExtensionInstall from '@/modules/wallets/components/InstallExtension';
import AccessWalletBrowserExtensionAccess from '@/modules/wallets/components/access-extension';

import HowItWorks from '@/modules/how-it-works';
import BuyHardwareWallet from '@/modules/hardware';

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
