<template>
  <div
    class="mew-component--tools"
    :class="$vuetify.breakpoint.smAndDown ? 'mobile' : 'desktop'"
  >
    <the-layout-header title="Tools" class="pt-16" />

    <v-container class="px-3 my-12">
      <mew-tabs
        :is-vertical="$vuetify.breakpoint.smAndDown ? false : true"
        :compact="$vuetify.breakpoint.smAndDown"
        :items="items"
        :active-tab="activeTab"
        show-arrows
        @onTab="tabChanged"
      >
        <template #tabItemContent1>
          <module-message-verify ref="verifyMessageModule" />
        </template>
        <template #tabItemContent2>
          <module-tools-convert />
        </template>
        <template #tabItemContent3>
          <module-tools-offline-helper :is-home-page="true" />
        </template>
      </mew-tabs>
    </v-container>
    <get-started />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import TheLayoutHeader from '@/views/components-default/TheLayoutHeader.vue';
import ModuleToolsConvert from '@/modules/tools/ModuleToolsConvert.vue';
import ModuleToolsOfflineHelper from '@/modules/tools/ModuleToolsOfflineHelper.vue';
import ModuleMessageVerify from '@/modules/message/ModuleMessageVerify.vue';
import GetStarted from '@/views/components-default/GetStarted.vue';

import { ROUTES_HOME } from '@/core/configs/configRoutes';

// injections
const route = useRoute();
const router = useRouter();

// data
const currentTool = ref('');
const activeTab = ref(0);
const items = [
  {
    name: 'Verify Message',
    val: 'verify'
  },
  {
    name: 'Convert Units',
    val: 'convert'
  },
  {
    name: 'Send Offline Helper',
    val: 'offline'
  }
];
const verifyMessageModule = ref(null);

// watch
watch(route, () => {
  setCurrentTool();
});

watch(currentTool, val => {
  verifyMessageModule.value?.clearAll();
  router.push({ name: ROUTES_HOME.TOOLS.NAME, query: { tool: val } });
});

// mounted
onMounted(() => {
  setCurrentTool();
});

// methods
const setCurrentTool = () => {
  const tools = ['convert', 'offline', 'verify'];

  // Check if tool value from URL is valid
  if (tools.includes(route.query.tool)) {
    currentTool.value = route.query.tool;

    switch (currentTool.value) {
      case 'verify':
        activeTab.value = 0;
        currentTool.value = 'verify';
        break;

      case 'convert':
        activeTab.value = 1;
        currentTool.value = 'convert';
        break;
      case 'offline':
        activeTab.value = 2;
        currentTool.value = 'offline';
        break;
      default:
        activeTab.value = 0;
        currentTool.value = 'verify';
    }
  } else {
    activeTab.value = 0;
    currentTool.value = 'verify';
  }
};

const tabChanged = tab => {
  activeTab.value = tab;

  switch (tab) {
    case 0:
      currentTool.value = 'verify';
      break;
    case 1:
      currentTool.value = 'convert';
      break;
    case 2:
      currentTool.value = 'offline';
      break;
    default:
      currentTool.value = 'verify';
  }
};
</script>

<style lang="scss">
.mew-component--tools.desktop .v-item-group.v-slide-group {
  padding-right: 40px;
  margin-right: 40px;
  border-right: 1px solid var(--v-greyLight-base) !important;
}
</style>
