const ConvertUnits = () => import('@/layouts/ConvertUnits');
const TeamLayout = () => import('@/layouts/TeamLayout');
const PrivacyPolicyLayout = () => import('@/layouts/PrivacyPolicyLayout');
const TermsAndConditionsLayout = () =>
  import('@/layouts/TermsAndConditionsLayout');
const AccessWalletLayout = () => import('@/layouts/AccessWalletLayout');
const InterfaceLayout = () => import('@/layouts/InterfaceLayout');
const HelpCenterLayout = () => import('@/layouts/HelpCenterLayout');
const NotFoundLayout = () => import('@/layouts/NotFoundLayout');
const GettingStarted = () => import('@/layouts/GettingStarted');
const SendOfflineHelper = () => import('@/layouts/SendOfflineHelper');
const VerifyMessageLayout = () => import('@/layouts/VerifyMessageLayout');
const DappSubmission = () => import('@/layouts/DappSubmissionLayout');
const AboutYourDapp = () =>
  import('@/layouts/DappSubmissionLayout/containers/AboutYourDappContainer');
const AboutYourTeam = () =>
  import('@/layouts/DappSubmissionLayout/containers/AboutYourTeamContainer');
const DappSummary = () =>
  import('@/layouts/DappSubmissionLayout/containers/SummaryContainer');

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
    path: '/access-my-wallet',
    name: 'AccessWalletLayout',
    component: AccessWalletLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/help-center',
    name: 'HelpCenterLayout',
    component: HelpCenterLayout,
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
    path: '/dapp-submission',
    component: DappSubmission,
    meta: { requiresAuth: false, name: 'referrer' },
    children: [
      {
        path: '',
        name: 'DappSubmission',
        component: AboutYourDapp,
        meta: { requiresAuth: false }
      },
      {
        path: 'about-your-dapp',
        name: 'AboutYourDapp',
        component: AboutYourDapp,
        meta: { requiresAuth: false }
      },
      {
        path: 'about-your-team',
        name: 'AboutYourTeam',
        component: AboutYourTeam,
        meta: { requiresAuth: false }
      },
      {
        path: 'dapp-summary',
        name: 'DappSummary',
        component: DappSummary,
        meta: { requiresAuth: false, name: 'referrer' }
      }
    ]
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

Object.keys(dapps).forEach(dapp => {
  router[router.length - 1].children.push(dapps[dapp]);
});

export default router;
