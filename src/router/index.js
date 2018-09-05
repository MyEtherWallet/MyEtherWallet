import Vue from 'vue'
import Router from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout'
import CreateWalletLayout from '@/layouts/CreateWalletLayout'
import TeamLayout from '@/layouts/TeamLayout'
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout'
import TermsOfConditionsLayout from '@/layouts/TermsOfConditionsLayout'
import AccessWalletLayout from '@/layouts/AccessWalletLayout'
import InterfaceLayout from '@/layouts/InterfaceLayout'
import HelpCenterLayout from '@/layouts/HelpCenterLayout'
import ConvertUnits from '@/layouts/ConvertUnits'
import NotFoundLayout from '@/layouts/NotFoundLayout'
import CreateWalletWarningLayout from '@/layouts/CreateWalletWarningLayout'
import ExtensionsLayout from '@/layouts/ExtensionsLayout'
import DebugsLayout from '@/layouts/DebugsLayout'
import TxStatusLayout from '@/layouts/TxStatusLayout'
import { router as routerConfig } from '@/configs/build'

Vue.use(Router)

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
      path: '/terms-of-conditions',
      name: 'TermsOfConditionsLayout',
      component: TermsOfConditionsLayout
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
      path: '/convert-units',
      name: 'ConvertUnits',
      component: ConvertUnits
    },
    {
      path: '/getting-started',
      name: 'CreateWalletWarningLayout',
      component: CreateWalletWarningLayout
    },
    {
      path: '/extensions',
      name: 'ExtensionsLayout',
      component: ExtensionsLayout
    },
    {
      path: '/debugs',
      name: 'DebugsLayout',
      component: DebugsLayout
    },
    {
      path: '/txstatus',
      name: 'TxStatusLayout',
      component: TxStatusLayout
    },
    {
      path: '*',
      name: '404',
      component: NotFoundLayout
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      window.scrollTo(0, 0)
    }
  }
})
