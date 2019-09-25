const ConvertUnits = () => import('@/layouts/ConvertUnits');
const TeamLayout = () => import('@/layouts/TeamLayout');
const PrivacyPolicyLayout = () => import('@/layouts/PrivacyPolicyLayout');
const TermsAndConditionsLayout = () =>
  import('@/layouts/TermsAndConditionsLayout');
const InterfaceLayout = () => import('@/layouts/InterfaceLayout');
const HelpCenterLayout = () => import('@/layouts/HelpCenterLayout');
const NotFoundLayout = () => import('@/layouts/NotFoundLayout');
const GettingStarted = () => import('@/layouts/GettingStarted');
const SendOfflineHelper = () => import('@/layouts/SendOfflineHelper');
const VerifyMessageLayout = () => import('@/layouts/VerifyMessageLayout');

const DappsContainer = () =>
  import('@/layouts/InterfaceLayout/containers/DappsContainer');
const DeployContractContainer = () =>
  import('@/layouts/InterfaceLayout/containers/DeployContractContainer');
const InteractWithContractContainer = () =>
  import('@/layouts/InterfaceLayout/containers/InteractWithContractContainer');
const NFTManagerContainer = () =>
  import('@/layouts/InterfaceLayout/containers/NFTManagerContainer');
const SendCurrencyContainer = () =>
  import('@/layouts/InterfaceLayout/containers/SendCurrencyContainer');
const SendOfflineContainer = () =>
  import('@/layouts/InterfaceLayout/containers/SendOfflineContainer');
const SwapContainer = () =>
  import('@/layouts/InterfaceLayout/containers/SwapContainer');
const SignMessageContainer = () =>
  import('@/layouts/InterfaceLayout/containers/SignMessageContainer');
const VerifyMessageContainer = () =>
  import('@/layouts/InterfaceLayout/containers/VerifyMessageContainer');
const HardwaresLayout = () => import('@/layouts/HardwaresLayout');
const ViewWalletInfoLayout = () => import('@/layouts/ViewWalletInfoLayout');
const PhishingCatcherLayout = () => import('@/layouts/PhishingCatcherLayout');
const DashboardContainer = () =>
  import('@/layouts/InterfaceLayout/containers/DashboardContainer');

import dapps from '@/dapps/routes';

const router = [
  {
    path: '/team',
    name: 'TeamLayout',
    component: TeamLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyLayout',
    component: PrivacyPolicyLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsAndConditionsLayout',
    component: TermsAndConditionsLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/help-center',
    name: 'HelpCenterLayout',
    component: HelpCenterLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/phishing-catcher',
    name: 'PhishingCatcherLayout',
    component: PhishingCatcherLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/convert-units',
    name: 'ConvertUnits',
    component: ConvertUnits,
    meta: { requiresAuth: false }
  },
  {
    path: '/getting-started',
    name: 'GettingStarted',
    component: GettingStarted,
    meta: { requiresAuth: false }
  },
  {
    path: '/hardware-wallet-affiliates',
    name: 'HardwaresLayout',
    component: HardwaresLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/send-offline-helper',
    name: 'SendOfflineHelper',
    component: SendOfflineHelper,
    meta: { requiresAuth: false }
  },
  {
    path: '/verify-message',
    name: 'VerifyMessageLayout',
    component: VerifyMessageLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '*',
    name: '404',
    component: NotFoundLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/view-wallet-info',
    name: 'ViewWalletInfoLayout',
    component: ViewWalletInfoLayout
  },
  {
    path: '/interface',
    component: InterfaceLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardContainer
      },
      {
        path: 'dashboard',
        name: 'Dashboard Container',
        component: DashboardContainer
      },
      {
        path: 'dapps',
        name: 'Dapps',
        component: DappsContainer
      },
      {
        path: 'deploy-contract',
        name: 'Deploy Contract',
        component: DeployContractContainer
      },
      {
        path: 'interact-with-contract',
        name: 'Interact With Contract',
        component: InteractWithContractContainer
      },
      {
        path: 'send-transaction',
        name: 'Send Tx',
        component: SendCurrencyContainer
      },
      {
        path: 'send-offline',
        name: 'Send Offline Container',
        component: SendOfflineContainer
      },
      {
        path: 'swap',
        name: 'Swap',
        component: SwapContainer
      },
      {
        path: 'sign-message',
        name: 'Sign Message',
        component: SignMessageContainer
      },
      {
        path: 'verify-message',
        name: 'Verify Message',
        component: VerifyMessageContainer
      },
      {
        path: 'nft-manager',
        name: 'NFTManager',
        component: NFTManagerContainer
      }
    ]
  }
];

if (BUILD_TYPE === 'mewcx') {
  const newArr = [];
  router[12].children.forEach(item => {
    if (item.path !== 'send-offline') {
      newArr.push(item);
    }
  });

  router[12].children = newArr;
}

Object.keys(dapps).forEach(dapp => {
  router[router.length - 1].children.push(dapps[dapp]);
});

export default router;
