import Vue from 'vue';
import Router from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout';
import CreateWalletLayout from '@/layouts/CreateWalletLayout';
import TeamLayout from '@/layouts/TeamLayout';
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout';
import TermsAndConditionsLayout from '@/layouts/TermsAndConditionsLayout';
import AccessWalletLayout from '@/layouts/AccessWalletLayout';
import InterfaceLayout from '@/layouts/InterfaceLayout';
import HelpCenterLayout from '@/layouts/HelpCenterLayout';
import NotFoundLayout from '@/layouts/NotFoundLayout';
import GettingStarted from '@/layouts/GettingStarted';
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
      component: InterfaceLayout
    },
    {
      path: '/help-center',
      name: 'HelpCenterLayout',
      component: HelpCenterLayout
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
