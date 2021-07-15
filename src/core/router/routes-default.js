import TheDefaultView from '@/views/TheDefaultView';
import TheHomeLayout from '@/views/layouts-default/TheHomeLayout';
import TheHowItWorksLayout from '@/views/layouts-default/TheHowItWorksLayout';
import TheCompanyLayout from '@/views/layouts-default/TheCompanyLayout';
import TheTeamLayout from '@/views/layouts-default/TheTeamLayout';
import ThePressKitLayout from '@/views/layouts-default/ThePressKitLayout';
import TheDappSubmissionLayout from '@/views/layouts-default/TheDappSubmissionLayout';
import TheBuyHardwareWalletLayout from '@/views/layouts-default/TheBuyHardwareWalletLayout';
import TheToolsLayout from '@/views/layouts-default/TheToolsLayout';
import TheCreateWalletLayout from '@/views/layouts-default/TheCreateWalletLayout';
import TheAccessWalletLayout from '@/views/layouts-default/TheAccessWalletLayout';
import ThePrivacyPolicyLayout from '@/views/layouts-default/ThePrivacyPolicyLayout';
import TheSecurityPolicyLayout from '@/views/layouts-default/TheSecurityPolicyLayout';
import TheTermsOfServiceLayout from '@/views/layouts-default/TheTermsOfServiceLayout';
import {
  createWalletProps,
  createRouteGuard,
  accessWalletProps,
  accessRouteGuard
} from './helpers';

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
        noAuth: true
      }
    },
    {
      path: 'how-it-works',
      name: 'HowItWorks',
      component: TheHowItWorksLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'security-policy',
      name: 'SecurityPolicy',
      component: TheSecurityPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'privacy-policy',
      name: 'PrivacyPolicy',
      component: ThePrivacyPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'terms-of-service',
      name: 'TermsOfService',
      component: TheTermsOfServiceLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'tools',
      name: 'Tools',
      component: TheToolsLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'buy-hardware-wallet',
      name: 'BuyHardwareWallet',
      component: TheBuyHardwareWalletLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'company',
      name: 'CompanyPage',
      component: TheCompanyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'team',
      name: 'TeamPage',
      component: TheTeamLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'presskit',
      name: 'PressKit',
      component: ThePressKitLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'dapp-submission',
      name: 'DappSubmission',
      component: TheDappSubmissionLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: 'wallet/create/:overlay?',
      name: 'CreateWallet',
      component: TheCreateWalletLayout,
      props: createWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: createRouteGuard
    },
    {
      path: 'wallet/access/:overlay?',
      name: 'AccessWallet',
      component: TheAccessWalletLayout,
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    }
  ]
};
