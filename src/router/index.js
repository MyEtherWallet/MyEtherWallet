import Vue from 'vue';
import Router from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout';
import CreateWalletLayout from '@/layouts/CreateWalletLayout';
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
import SwapContainer from '@/layouts/InterfaceLayout/containers/SwapContainer';
import SignMessageContainer from '@/layouts/InterfaceLayout/containers/SignMessageContainer';
import VerifyMessageContainer from '@/layouts/InterfaceLayout/containers/VerifyMessageContainer';
import { router as routerConfig } from '@/configs/build';

Vue.use(Router);

export default new Router({
  mode: routerConfig.mode,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeLayout
    },
    {
      path: '/create-wallet',
      name: 'CreateWalletLayout',
      component: CreateWalletLayout
    },
    {
      path: '/team',
      name: 'TeamLayout',
      component: TeamLayout
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicyLayout',
      component: PrivacyPolicyLayout
    },
    {
      path: '/terms-and-conditions',
      name: 'TermsAndConditionsLayout',
      component: TermsAndConditionsLayout
    },
    {
      path: '/access-my-wallet',
      name: 'AccessWalletLayout',
      component: AccessWalletLayout
    },
    {
      path: '/interface',
      name: 'InterfaceLayout',
      component: InterfaceLayout,
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
          path: 'send-offline-transaction',
          name: 'Send Offline',
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
        }
      ]
    },
    {
      path: '/help-center',
      name: 'HelpCenterLayout',
      component: HelpCenterLayout
    },
    {
      path: '/convert-units',
      name: 'ConvertUnits',
      component: ConvertUnits
    },
    {
      path: '/getting-started',
      name: 'GettingStarted',
      component: GettingStarted
    },
    {
      path: '*',
      name: '404',
      component: NotFoundLayout
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    window.scrollTo(0, 0);
  }
});
