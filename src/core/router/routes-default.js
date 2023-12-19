import { ROUTES_HOME } from '../configs/configRoutes';
import {
  createWalletProps,
  createRouteGuard,
  accessWalletProps,
  accessRouteGuard
} from './helpers';

export default {
  path: '/',
  component: () => import('@/views/TheDefaultView'),
  props: true,
  children: [
    {
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: () => import('@/views/layouts-default/TheHomeLayout'),
      meta: {
        noAuth: true,
        title: 'MyEtherWallet | The Best Crypto Wallet For Web3',
        description:
          'Trusted by millions of users, MyEtherWallet is the first and best open source Ethereum wallet. Create a secure crypto wallet, buy, sell, stake and swap.'
      }
    },
    {
      path: ROUTES_HOME.HOW_IT_WORKS.PATH,
      name: ROUTES_HOME.HOW_IT_WORKS.NAME,
      component: () => import('@/views/layouts-default/TheHowItWorksLayout'),
      meta: {
        noAuth: true,
        title: 'What MyEtherWallet Does | How MyEtherWallet Works',
        description:
          "How you can use MyEtherWallet to create a crypto wallet, swap crypto and more. Ethereum's original wallet."
      }
    },
    {
      path: ROUTES_HOME.SECURITY_POLICY.PATH,
      name: ROUTES_HOME.SECURITY_POLICY.NAME,
      component: () =>
        import('@/views/layouts-default/TheSecurityPolicyLayout'),
      meta: {
        noAuth: true,
        title: 'MyEtherWallet Security Policy | MyEtherWallet Bug Bounty',
        desription:
          'MyEtherWallet is devoted to keeping crypto users secure. Learn about the security and bug bounty for MyEtherWallet.'
      }
    },
    {
      path: ROUTES_HOME.PRIVACY_POLICY.PATH,
      name: ROUTES_HOME.PRIVACY_POLICY.NAME,
      component: () => import('@/views/layouts-default/ThePrivacyPolicyLayout'),
      meta: {
        noAuth: true,
        title: 'MyEtherWallet Privacy Policy | Privacy First Crypto Wallet',
        description:
          "MyEtherWallet's privacy policy. Learn how MyEtherWallet protects your privacy."
      }
    },
    {
      path: ROUTES_HOME.TERMS_OF_SERVICE.PATH,
      name: ROUTES_HOME.TERMS_OF_SERVICE.NAME,
      component: () =>
        import('@/views/layouts-default/TheTermsOfServiceLayout'),
      meta: {
        noAuth: true,
        title: 'MyEtherWallet Terms of Service',
        description:
          'Read the Terms of Service for MyEtherWallet. A privacy first, open source crypto wallet. '
      }
    },
    {
      path: ROUTES_HOME.TOOLS.PATH,
      name: ROUTES_HOME.TOOLS.NAME,
      component: () => import('@/views/layouts-default/TheToolsLayout'),
      meta: {
        noAuth: true,
        title: 'Tools For Ethereum | Verify Message | Send Offline',
        description:
          "Verify messages and send offline using MyEtherWallet. Ethereum's best crypto wallet since 2015."
      }
    },
    {
      path: ROUTES_HOME.BUY_HARDWARE_WALLET.PATH,
      name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME,
      component: () =>
        import('@/views/layouts-default/TheBuyHardwareWalletLayout'),
      meta: {
        noAuth: true,
        title: 'Buy a Hardware Crypto Wallet | Secure Your Crypto',
        description:
          'Buy a crypto hardware wallet from one of our trusted partners. Use Ledger, Trezor and others with MEW to keep your crypto secure.'
      }
    },
    {
      path: ROUTES_HOME.ABOUT_PAGE.PATH,
      name: ROUTES_HOME.ABOUT_PAGE.NAME,
      component: () => import('@/views/layouts-default/TheCompanyLayout'),
      meta: {
        noAuth: true,
        title: 'About MyEtherWallet | The Original Ethereum Wallet',
        description:
          'Learn about MyEtherWallet, the original Ethereum wallet. Founded in 2015, MyEtherWallet is trusted by millions of crypto users.'
      }
    },
    {
      path: ROUTES_HOME.TEAM_PAGE.PATH,
      name: ROUTES_HOME.TEAM_PAGE.NAME,
      component: () => import('@/views/layouts-default/TheTeamLayout'),
      meta: {
        noAuth: true,
        title: 'The Team Behind MyEtherWallet | Crypto Experts',
        description:
          'Meet the team behind MyEtherWallet. Crypto OGs, enthusiasts, developers, educators and more.'
      }
    },
    {
      path: ROUTES_HOME.PRESS_KIT.PATH,
      name: ROUTES_HOME.PRESS_KIT.NAME,
      component: () => import('@/views/layouts-default/ThePressKitLayout'),
      meta: {
        noAuth: true,
        title: 'Press Kit And Logos For MyEtherWallet',
        description:
          'The press kit and logos for MyEtherWallet. Download images and boilerplates for MEW.'
      }
    },
    {
      path: ROUTES_HOME.CONVERT_UNITS.PATH,
      name: ROUTES_HOME.CONVERT_UNITS.NAME,
      component: () => import('@/views/layouts-default/TheConvertUnitsLayout'),
      meta: {
        noAuth: true,
        title: 'Convert Ether Units | Ethereum Gas Calculator ',
        description:
          'Calculate your Ethereum gas with MyEtherWallet. Convert Gwei to ETH units easily with MEW.'
      }
    },
    {
      path: ROUTES_HOME.JOBS.PATH,
      name: ROUTES_HOME.JOBS.NAME,
      component: () => import('@/views/layouts-default/TheCareersLayout'),
      meta: {
        noAuth: true,
        title: 'Careers at MyEtherWallet',
        description:
          'Looking to work in crypto? Inquire about open positions at MyEtherWallet.'
      }
    },
    {
      path: ROUTES_HOME.ADVERTISE.PATH,
      name: ROUTES_HOME.ADVERTISE.NAME,
      component: () =>
        import('@/views/layouts-default/TheAdvertiseWithUsLayout'),
      meta: {
        noAuth: true,
        title: 'Advertise On MyEtherWallet | Grow Your Crypto Audience',
        description:
          "Advertise to MyEtherWallet's 3 million users. Maximize your crypto advertising spend."
      }
    },
    {
      path: ROUTES_HOME.QR_CODE.PATH,
      name: ROUTES_HOME.QR_CODE.NAME,
      component: () => import('@/views/layouts-default/TheQrCodeLayout'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      name: ROUTES_HOME.CREATE_WALLET.NAME,
      component: () => import('@/views/layouts-default/TheCreateWalletLayout'),
      props: createWalletProps,
      meta: {
        noAuth: true,
        title: 'Create A Crypto Wallet | Mobile and Browser Crypto Wallets',
        description:
          'Create a secure self custody crypto wallet using MyEtherWallet. Choose from our mobile app or browser extension wallet.'
      },
      beforeEnter: createRouteGuard
    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: () => import('@/views/layouts-default/TheAccessWalletLayout'),
      props: accessWalletProps,
      meta: {
        noAuth: true,
        title: 'Access Your Crypto Wallet on MyEtherWallet',
        description:
          'Use a web3 browser extension, hardware wallet or a mobile app to access your crypto wallet. Manage your NFTs and crypto all in one place!'
      },
      beforeEnter: accessRouteGuard
    }
  ]
};
