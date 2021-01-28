import TheDefaultView from '@/views/TheDefaultView';
import TheHomeLayout from '@/views/layouts-default/TheHomeLayout';
import TheHowItWorksLayout from '@/views/layouts-default/TheHowItWorksLayout';
import TheCompanyLayout from '@/views/layouts-default/TheCompanyLayout';
import TheTeamLayout from '@/views/layouts-default/TheTeamLayout';
import ThePressKitLayout from '@/views/layouts-default/ThePressKitLayout';
import TheBuyHardwareWalletLayout from '@/views/layouts-default/TheBuyHardwareWalletLayout';
import TheToolsLayout from '@/views/layouts-default/TheToolsLayout';
import TheCreateWalletLayout from '@/views/layouts-default/TheCreateWalletLayout';
import AccessWallet from '@/modules/wallets/pages/access/Access';
import HardwareWallets from '@/modules/wallets/pages/access/hardware-wallets/HardwareWallets';
import MobileApps from '@/modules/wallets/pages/access/mobile-apps/MobileApps';
import BrowserExtension from '@/modules/wallets/pages/access/browser-extension/BrowserExtension';
import BrowserExtensionInstall from '@/modules/wallets/pages/access/browser-extension/install-extension/InstallExtension';
import BrowserExtensionAccess from '@/modules/wallets/pages/access/browser-extension/access-extension/AccessExtension';
import ThePrivacyPolicyLayout from '@/views/layouts-default/ThePrivacyPolicyLayout';
import TheTermsOfServiceLayout from '@/views/layouts-default/TheTermsOfServiceLayout';

export default {
  path: '/',
  component: TheDefaultView,
  props: true,
  children: [
    {
      path: '',
      name: 'Home',
      component: TheHomeLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'how-it-works',
      name: 'HowItWorks',
      component: TheHowItWorksLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'privacy-policy',
      name: 'PrivacyPolicy',
      component: ThePrivacyPolicyLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'terms-of-service',
      name: 'TermsOfService',
      component: TheTermsOfServiceLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'tools',
      name: 'Tools',
      component: TheToolsLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'buy-hardware-wallet',
      name: 'BuyHardwareWallet',
      component: TheBuyHardwareWalletLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'company',
      name: 'CompanyPage',
      component: TheCompanyLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'team',
      name: 'TeamPage',
      component: TheTeamLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'presskit',
      name: 'PressKit',
      component: ThePressKitLayout,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'wallet/create',
      name: 'CreateWallet',
      component: TheCreateWalletLayout,
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
      path: 'wallet/access/browser-extension/install',
      name: 'BrowserExtensionInstall',
      component: BrowserExtensionInstall,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'wallet/access/browser-extension/access',
      name: 'BrowserExtensionAccess',
      component: BrowserExtensionAccess,
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
};
