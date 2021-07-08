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
import {
  createWalletProps,
  createRouteGuard,
  accessWalletProps,
  accessRouteGuard,
  ROUTES
} from './helpers';

export default {
  path: '/',
  component: TheDefaultView,
  props: true,
  children: [
    {
      path: ROUTES.Home.Path,
      name: ROUTES.Home.Name,
      component: TheHomeLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.HowItWorks.Path,
      name: ROUTES.HowItWorks.Name,
      component: TheHowItWorksLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.SecurityPolicy.Path,
      name: ROUTES.SecurityPolicy.Name,
      component: TheSecurityPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.PrivacyPolicy.Path,
      name: ROUTES.PrivacyPolicy.Name,
      component: ThePrivacyPolicyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.TermsOfService.Path,
      name: ROUTES.TermsOfService.Name,
      component: TheTermsOfServiceLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.Tools.Path,
      name: ROUTES.Tools.Name,
      component: TheToolsLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.BuyHardwareWallet.Path,
      name: ROUTES.BuyHardwareWallet.Name,
      component: TheBuyHardwareWalletLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.CompanyPage.Path,
      name: ROUTES.CompanyPage.Name,
      component: TheCompanyLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.TeamPage.Path,
      name: ROUTES.TeamPage.Name,
      component: TheTeamLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.PressKit.Path,
      name: ROUTES.PressKit.Name,
      component: ThePressKitLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES.CreateWallet.Path,
      name: ROUTES.CreateWallet.Name,
      component: TheCreateWalletLayout,
      props: createWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: createRouteGuard
    },
    {
      path: ROUTES.AccessWallet.Path,
      name: ROUTES.AccessWallet.Name,
      component: TheAccessWalletLayout,
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    }
  ]
};
