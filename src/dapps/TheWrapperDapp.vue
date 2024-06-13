<template>
  <!-- ===================================================================================== -->
  <!-- DAPP WRAPPER: -->
  <!-- ===================================================================================== -->
  <white-sheet class="the-wrapper-dapp">
    <!-- ===================================================================================== -->
    <!-- Mew Banner - props: bannerText, bannerImg -->
    <!-- TODO: Add block header to mew banner component -->
    <!-- ===================================================================================== -->
    <TheDappBlockHeader
      v-if="!isNewHeader"
      :text-obj="bannerTextObj"
      :banner-img="bannerImg"
      :title-icon="titleIcon"
      :no-back-btn="noBackBtn"
      :top-strip="topStrip"
      @closeBanner="onClose"
    >
      <template #body>
        <slot name="HeaderBody" />
      </template>
      <template #right>
        <slot name="HeaderRight" />
      </template>
    </TheDappBlockHeader>

    <!-- ===================================================================================== -->
    <!-- NER DAPP HEADER: -->
    <!-- ===================================================================================== -->
    <TheDappHeader
      v-else
      :dapp-name="bannerText.title"
      :dapp-text="bannerText.subtext"
      :dapp-img="dappImg"
    />

    <!-- ===================================================================================== -->
    <!-- Mew Tabs - props: tabItems, activeTab; takes in a slot for each -->
    <!-- tab content (tabContent + tab number ) -->
    <!-- TODO: remove hideDefaultTabHeader prop and refactor -->
    <!-- ===================================================================================== -->
    <mew-tabs
      v-if="tabItems.length > 0 && !isNewHeader"
      :class="[
        {
          'pt-5': !isNewHeader,
          'hide-default-tab-header': hideDefaultTabHeader
        }
      ]"
      :items="tabItems"
      :active-tab="activeTab"
      background="transparent"
      has-underline
      active-color="textDark"
      @onTab="onTab"
    >
      <template
        v-for="(item, idx) in tabItems"
        :slot="'tabContent' + (idx + 1)"
      >
        <slot :name="'tabContent' + (idx + 1)" />
      </template>
    </mew-tabs>

    <!-- ===================================================================================== -->
    <!-- NEW menu Tabs - props: tabItems, activeTab; takes in a slot for each -->
    <!-- tab content (tabContent + tab number ) -->
    <!-- TODO: remove hideDefaultTabHeader prop and refactor -->
    <!-- ===================================================================================== -->
    <v-tabs
      v-if="tabItems.length > 0 && isNewHeader"
      :value="activeTab"
      background-color="bgWalletBlockDark"
      color="blue500"
      height="46"
      class="tab-container"
      active-class="blue500--text"
      @change="onTab"
    >
      <v-tab
        v-for="(item, index) in tabItems"
        :key="index"
        :class="[
          'px-4 px-md-10 textMedium--text menu-tab-text mew-body',
          { 'ml-md-13': index === 0 },
          { 'mr-md-13': index + 1 === tabItems.length }
        ]"
        @click="routeToTab(item.route)"
      >
        <v-badge
          v-if="item.hasBadge"
          color="red"
          :content="item.badgeContent"
          :dot="item.badgeContent === ''"
          :inline="item.badgeContent !== ''"
          right
        >
          {{ item.name }}
        </v-badge>
        <div v-else>
          {{ item.name }}
        </div>
      </v-tab>
    </v-tabs>

    <!-- ===================================================================================== -->
    <!-- NEW ROUTER VIEW: FOR is NEW HEADER (specify in dapp metaInfo) -->
    <!-- ===================================================================================== -->
    <slot
      v-if="activeTab === 0 && externalContents && isValidNetwork"
      name="tabContent1"
    />
    <slot
      v-if="activeTab === 1 && externalContents && isValidNetwork"
      name="tabContent2"
    />
    <slot
      v-if="activeTab === 2 && externalContents && isValidNetwork"
      name="tabContent3"
    />

    <router-view
      v-if="
        tabItems.length > 0 &&
        isNewHeader &&
        isValidNetwork &&
        !externalContents
      "
    />
    <div
      v-if="tabItems.length > 0 && isNewHeader && !isValidNetwork"
      class="px-3 py-8 pa-md-15"
    >
      <mew-alert
        theme="warning"
        hide-close-icon
        title="This DApp is not available on this network"
        :description="networkAlertText"
      />
    </div>

    <!-- ===================================================================================== -->
    <!-- Slot: content, used to place body content if not using tabs. -->
    <!-- ===================================================================================== -->
    <div v-if="tabItems.length === 0" class="pt-8 px-3 pa-md-8">
      <slot name="content" />
    </div>
  </white-sheet>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from 'vue';

import bannerImage from '@/assets/images/backgrounds/bg-dapps-center.jpg';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

import TheDappBlockHeader from './TheDappBlockHeader.vue';
import TheDappHeader from './TheDappHeader.vue';

import { useGlobalStore } from '@/core/store/global';

const { network } = useGlobalStore();

const props = defineProps({
  hasExitBtn: {
    default: false,
    type: Boolean
  },
  bannerImg: {
    default: bannerImage,
    type: String
  },
  bannerText: {
    default: () => {},
    type: Object
  },
  tabItems: {
    default: () => [],
    type: Array
  },
  activeTab: {
    default: 0,
    type: Number
  },
  titleIcon: {
    default: '',
    type: String
  },
  noBackBtn: {
    default: false,
    type: Boolean
  },
  topStrip: {
    default: false,
    type: Boolean
  },
  onTab: {
    default: () => {},
    type: Function
  },
  hideDefaultTabHeader: {
    default: false,
    type: Boolean
  },
  isNewHeader: {
    default: false,
    type: Boolean
  },
  dappImg: {
    default: '',
    type: String
  },
  validNetworks: {
    default: () => [],
    type: Array
  },
  externalContents: {
    default: false,
    type: Boolean
  }
});

// Data
const bannerTextObj = ref({});

// computed
const isValidNetwork = computed(() => {
  const chainID = network.value.type.chainID;
  const validChain = props.validNetworks.filter(
    item => item.chainID === chainID
  );
  return validChain.length > 0;
});

const networkAlertText = computed(() => {
  const names = props.validNetworks.map(item => item.name_long).join(', ');
  const netString = props.validNetworks.length > 1 ? 'networks' : 'network';
  return `Please select ${names} ${netString} to use this Dapp.`;
});

onMounted(() => {
  bannerTextObj.value = props.bannerText;
  if (props.hasExitBtn) {
    bannerTextObj.value = 'Exit DApp';
  }
});

// methods
const onClose = () => {
  this.$router.push({
    name: 'Dapps'
  });
};

const routeToTab = route => {
  try {
    this.$router.push(route);
  } catch (e) {
    Toast(e, {}, ERROR);
  }
};
</script>

<style lang="scss">
.tab-container {
  .v-slide-group__prev {
    display: none !important;
  }
}
.the-wrapper-dapp {
  .hide-default-tab-header {
    .v-tabs {
      display: none;
    }
  }
  .menu-tab-text {
    text-transform: none !important;
  }
}
</style>
