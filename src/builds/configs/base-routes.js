const ConvertUnits = () => import('@/layouts/ConvertUnits');
const PressKit = () => import('@/layouts/PressKit');
const TeamLayout = () => import('@/layouts/TeamLayout');
const SecurityPolicy = () => import('@/layouts/SecurityPolicy');
const PrivacyPolicyLayout = () => import('@/layouts/PrivacyPolicyLayout');
const TermsOfService = () => import('@/layouts/TermsOfService');
const InterfaceLayout = () => import('@/layouts/InterfaceLayout');
const NotFoundLayout = () => import('@/layouts/NotFoundLayout');
const GettingStarted = () => import('@/layouts/GettingStarted');
const SendOfflineHelper = () => import('@/layouts/SendOfflineHelper');
const VerifyMessageLayout = () => import('@/layouts/VerifyMessageLayout');
const GenerateAddressLayout = () => import('@/layouts/GenerateAddressLayout');
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
    path: '/security-policy',
    name: 'SecurityPolicy',
    component: SecurityPolicy,
    meta: { requiresAuth: false }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyLayout',
    component: PrivacyPolicyLayout,
    meta: { requiresAuth: false }
  },
  {
    // temporary until mewconnect fixes the path
    path: '/privacy-policy.html',
    name: 'PrivacyPolicyLayoutHtml',
    component: PrivacyPolicyLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: TermsOfService,
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
    path: '/press-kit',
    name: 'PressKit',
    component: PressKit,
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
        meta: { requiresAuth: false }
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
    path: '/generate-eth2-keystore',
    name: 'GenerateAddressLayout',
    component: GenerateAddressLayout,
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
