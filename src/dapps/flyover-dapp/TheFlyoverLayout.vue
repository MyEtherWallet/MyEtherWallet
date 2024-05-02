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
<script setup>
import {
  defineAsyncComponent,
  ref,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue';

import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import { FLYOVER_ROUTE } from './routes';
import { useI18n } from 'vue-i18n-composable';
import { useRoute } from 'vue-router/composables';

const TheWrapperDapp = defineAsyncComponent(() =>
  import('@/dapps/TheWrapperDapp.vue')
);
const ModulePegin = defineAsyncComponent(() => import('./modules/ModulePegin'));
const ModulePegout = defineAsyncComponent(() =>
  import('./modules/ModulePegout')
);

// injections
const { t } = useI18n();
const route = useRoute();

// data
const validNetworks = SUPPORTED_NETWORKS;
const headerImg = require('@/assets/images/icons/dapps/icon-dapp-flyover.svg');
const header = {
  title: t('flyover.title'),
  subtext: t('flyover.dapp-desc')
};
const tabs = [
  {
    name: t('flyover.pegin.title'),
    route: { name: FLYOVER_ROUTE.PEGIN.NAME },
    id: 0
  },
  {
    name: t('flyover.pegout.title'),
    route: {
      name: FLYOVER_ROUTE.PEGOUT.NAME,
      path: FLYOVER_ROUTE.PEGOUT.PATH
    },
    id: 1
  }
];
const activeTab = ref(0);

// watch
watch(route, () => {
  detachUrlChangeTab();
});

// mounted
onMounted(() => {
  setup();
});

// beforeDestroy
onBeforeUnmount(() => {
  document.getElementById('recaptchaScript').remove();
});

// methods
const setup = () => {
  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('defer', '');
  script.id = 'recaptchaScript';
  script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
  document.getElementsByTagName('head')[0].appendChild(script);
};
const detachUrlChangeTab = () => {
  const currentRoute = route.name;
  if (currentRoute === FLYOVER_ROUTE.PEGOUT.NAME) {
    activeTab.value = tabs[1].id;
  } else {
    activeTab.value = tabs[0].id;
  }
};
const tabChanged = tab => {
  activeTab.value = tab;
};
</script>
