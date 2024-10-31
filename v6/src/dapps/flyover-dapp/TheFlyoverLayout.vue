<template>
  <div>
    <the-wrapper-dapp
      :is-new-header="true"
      :dapp-img="headerImg"
      :banner-text="header"
      :tab-items="tabs"
      :active-tab="activeTab"
      external-contents
      :on-tab="tabChanged"
      :valid-networks="validNetworks"
    >
      <!--
    =====================================================================================
      Pegin
    =====================================================================================
    -->
      <template #tabContent1>
        <v-sheet
          max-width="700px"
          color="transparent"
          class="px-3 py-2 py-md-2 mx-auto"
        >
          <module-pegin></module-pegin>
        </v-sheet>
      </template>

      <!--
    =====================================================================================
     Pegout
    =====================================================================================
    -->
      <template #tabContent2>
        <v-sheet
          max-width="700px"
          color="transparent"
          class="px-3 py-2 py-md-2 mx-auto"
        >
          <module-pegout></module-pegout>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
  </div>
</template>
<script>
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { FLYOVER_ROUTE } from './routes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin.js';

export default {
  name: 'FlyoverLayout',
  components: {
    TheWrapperDapp: () => import('@/dapps/TheWrapperDapp.vue'),
    ModulePegin: () => import('./modules/ModulePegin'),
    ModulePegout: () => import('./modules/ModulePegout')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      validNetworks: SUPPORTED_NETWORKS,
      headerImg: require('@/assets/images/icons/dapps/icon-dapp-flyover.svg'),
      header: {
        title: this.$t('flyover.title'),
        subtext: this.$t('flyover.dapp-desc')
      },
      activeTab: 0,
      tabs: [
        {
          name: this.$t('flyover.pegin.title'),
          route: { name: FLYOVER_ROUTE.PEGIN.NAME },
          id: 0
        },
        {
          name: this.$t('flyover.pegout.title'),
          route: {
            name: FLYOVER_ROUTE.PEGOUT.NAME,
            path: FLYOVER_ROUTE.PEGOUT.PATH
          },
          id: 1
        }
      ]
    };
  },
  computed: {},
  watch: {
    $route() {
      this.detactUrlChangeTab();
    }
  },
  mounted() {
    this.setup();
  },
  beforeDestroy() {
    document.getElementById('recaptchaScript').remove();
  },
  methods: {
    setup() {
      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('defer', '');
      script.id = 'recaptchaScript';
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      document.getElementsByTagName('head')[0].appendChild(script);
    },
    detactUrlChangeTab() {
      const currentRoute = this.$route.name;
      if (currentRoute === FLYOVER_ROUTE.PEGOUT.NAME) {
        this.activeTab = this.tabs[1].id;
      } else {
        this.activeTab = this.tabs[0].id;
      }
    },
    tabChanged(tab) {
      this.activeTab = tab;
    }
  }
};
</script>
