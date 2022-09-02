const TheDefaultView = () => import('@/views/TheDefaultView');
const TheHomeLayout = () => import('@/views/layouts-default/TheHomeLayout');
const TheHowItWorksLayout = () =>
  import('@/views/layouts-default/TheHowItWorksLayout');
const TheCompanyLayout = () =>
  import('@/views/layouts-default/TheCompanyLayout');
const TheTeamLayout = () => import('@/views/layouts-default/TheTeamLayout');
const ThePressKitLayout = () =>
  import('@/views/layouts-default/ThePressKitLayout');
const TheDappSubmissionLayout = () =>
  import('@/views/layouts-default/TheDappSubmissionLayout');
const TheBuyHardwareWalletLayout = () =>
  import('@/views/layouts-default/TheBuyHardwareWalletLayout');
const TheToolsLayout = () => import('@/views/layouts-default/TheToolsLayout');
const TheCreateWalletLayout = () =>
  import('@/views/layouts-default/TheCreateWalletLayout');
const TheAccessWalletLayout = () =>
  import('@/views/layouts-default/TheAccessWalletLayout');
const ThePrivacyPolicyLayout = () =>
  import('@/views/layouts-default/ThePrivacyPolicyLayout');
const TheSecurityPolicyLayout = () =>
  import('@/views/layouts-default/TheSecurityPolicyLayout');
const TheTermsOfServiceLayout = () =>
  import('@/views/layouts-default/TheTermsOfServiceLayout');
const TheConvertUnitsLayout = () =>
  import('@/views/layouts-default/TheConvertUnitsLayout');
const TheCareersLayout = () =>
  import('@/views/layouts-default/TheCareersLayout');
const TheQrCodeLayout = () => import('@/views/layouts-default/TheQrCodeLayout');
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
      path: ROUTES_HOME.ABOUT_PAGE.PATH,
      name: ROUTES_HOME.ABOUT_PAGE.NAME,
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
      path: ROUTES_HOME.CONVERT_UNITS.PATH,
      name: ROUTES_HOME.CONVERT_UNITS.NAME,
      component: TheConvertUnitsLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.JOBS.PATH,
      name: ROUTES_HOME.JOBS.NAME,
      component: TheCareersLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.QR_CODE.PATH,
      name: ROUTES_HOME.QR_CODE.NAME,
      component: TheQrCodeLayout,
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
