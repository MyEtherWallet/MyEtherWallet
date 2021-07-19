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
import { ROUTES_HOME } from '../configs/configRoutes';
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
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: TheHomeLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.HOW_IT_WORKS.PATH,
      name: ROUTES_HOME.HOW_IT_WORKS.NAME,
      component: TheHowItWorksLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.SECURITY_POLICY.PATH,
      name: ROUTES_HOME.SECURITY_POLICY.NAME,
      component: TheSecurityPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PRIVACY_POLICY.PATH,
      name: ROUTES_HOME.PRIVACY_POLICY.NAME,
      component: ThePrivacyPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TERMS_OF_SERVICE.PATH,
      name: ROUTES_HOME.TERMS_OF_SERVICE.NAME,
      component: TheTermsOfServiceLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TOOLS.PATH,
      name: ROUTES_HOME.TOOLS.NAME,
      component: TheToolsLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.BUY_HARDWARE_WALLET.PATH,
      name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME,
      component: TheBuyHardwareWalletLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.COMPANY_PAGE.PATH,
      name: ROUTES_HOME.COMPANY_PAGE.NAME,
      component: TheCompanyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TEAM_PAGE.PATH,
      name: ROUTES_HOME.TEAM_PAGE.NAME,
      component: TheTeamLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PRESS_KIT.PATH,
      name: ROUTES_HOME.PRESS_KIT.NAME,
      component: ThePressKitLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.DAPP_SUBMISSION.PATH,
      name: ROUTES_HOME.DAPP_SUBMISSION.NAME,
      component: TheDappSubmissionLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      name: ROUTES_HOME.CREATE_WALLET.NAME,
      component: TheCreateWalletLayout,
      props: createWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: createRouteGuard
    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: TheAccessWalletLayout,
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    }
  ]
};
