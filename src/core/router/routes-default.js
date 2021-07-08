import TheDefaultView from '@/views/TheDefaultView';
import TheHomeLayout from '@/views/layouts-default/TheHomeLayout';
import TheHowItWorksLayout from '@/views/layouts-default/TheHowItWorksLayout';
import TheCompanyLayout from '@/views/layouts-default/TheCompanyLayout';
import TheTeamLayout from '@/views/layouts-default/TheTeamLayout';
import ThePressKitLayout from '@/views/layouts-default/ThePressKitLayout';
import TheBuyHardwareWalletLayout from '@/views/layouts-default/TheBuyHardwareWalletLayout';
import TheToolsLayout from '@/views/layouts-default/TheToolsLayout';
import TheCreateWalletLayout from '@/views/layouts-default/TheCreateWalletLayout';
import TheAccessWalletLayout from '@/views/layouts-default/TheAccessWalletLayout';
import ThePrivacyPolicyLayout from '@/views/layouts-default/ThePrivacyPolicyLayout';
import TheSecurityPolicyLayout from '@/views/layouts-default/TheSecurityPolicyLayout';
import TheTermsOfServiceLayout from '@/views/layouts-default/TheTermsOfServiceLayout';
import { ROUTES_HOME } from './config-routes';
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
      path: ROUTES_HOME.Home.Path,
      name: ROUTES_HOME.Home.Name,
      component: TheHomeLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.HowItWorks.Path,
      name: ROUTES_HOME.HowItWorks.Name,
      component: TheHowItWorksLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.SecurityPolicy.Path,
      name: ROUTES_HOME.SecurityPolicy.Name,
      component: TheSecurityPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PrivacyPolicy.Path,
      name: ROUTES_HOME.PrivacyPolicy.Name,
      component: ThePrivacyPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TermsOfService.Path,
      name: ROUTES_HOME.TermsOfService.Name,
      component: TheTermsOfServiceLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.Tools.Path,
      name: ROUTES_HOME.Tools.Name,
      component: TheToolsLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.BuyHardwareWallet.Path,
      name: ROUTES_HOME.BuyHardwareWallet.Name,
      component: TheBuyHardwareWalletLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CompanyPage.Path,
      name: ROUTES_HOME.CompanyPage.Name,
      component: TheCompanyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TeamPage.Path,
      name: ROUTES_HOME.TeamPage.Name,
      component: TheTeamLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PressKit.Path,
      name: ROUTES_HOME.PressKit.Name,
      component: ThePressKitLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CreateWallet.Path,
      name: ROUTES_HOME.CreateWallet.Name,
      component: TheCreateWalletLayout,
      props: createWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: createRouteGuard
    },
    {
      path: ROUTES_HOME.AccessWallet.Path,
      name: ROUTES_HOME.AccessWallet.Name,
      component: TheAccessWalletLayout,
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    }
  ]
};
