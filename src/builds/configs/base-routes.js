import ConvertUnits from '@/layouts/ConvertUnits';
import TeamLayout from '@/layouts/TeamLayout';
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout';
import TermsAndConditionsLayout from '@/layouts/TermsAndConditionsLayout';
import AccessWalletLayout from '@/layouts/AccessWalletLayout';
import InterfaceLayout from '@/layouts/InterfaceLayout';
import HelpCenterLayout from '@/layouts/HelpCenterLayout';
import NotFoundLayout from '@/layouts/NotFoundLayout';
import GettingStarted from '@/layouts/GettingStarted';

import DappsContainer from '@/layouts/InterfaceLayout/containers/DappsContainer';
import DeployContractContainer from '@/layouts/InterfaceLayout/containers/DeployContractContainer';
import InteractWithContractContainer from '@/layouts/InterfaceLayout/containers/InteractWithContractContainer';
import SendCurrencyContainer from '@/layouts/InterfaceLayout/containers/SendCurrencyContainer';
import SendOfflineContainer from '@/layouts/InterfaceLayout/containers/SendOfflineContainer';
import offlineRoutes from '@/layouts/InterfaceLayout/containers/SendOfflineContainer/routes';
import SwapContainer from '@/layouts/InterfaceLayout/containers/SwapContainer';
import SignMessageContainer from '@/layouts/InterfaceLayout/containers/SignMessageContainer';
import VerifyMessageContainer from '@/layouts/InterfaceLayout/containers/VerifyMessageContainer';

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
    path: '*',
    name: '404',
    component: NotFoundLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/interface',
    component: InterfaceLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Send Transaction',
        component: SendCurrencyContainer
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
        component: SendOfflineContainer,
        children: offlineRoutes.children.map(item => {
          item['meta'] = { requiresAuth: true };
          return item;
        })
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
      }
    ]
  }
];

Object.keys(dapps).forEach(dapp => {
  router[router.length - 1].children.push(dapps[dapp]);
});

router[router.length - 1].children.map(route => {
  if (route.hasOwnProperty('children')) {
    route.children.map(childRoute => {
      childRoute['meta'] = { requiresAuth: true };
      return childRoute;
    });
  }

  route['meta'] = { requiresAuth: true };
  return route;
});

export default router;
