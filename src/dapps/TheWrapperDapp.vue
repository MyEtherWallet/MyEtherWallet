<template>
  <!-- ===================================================================================== -->
  <!-- DAPP WRAPPER: -->
  <!-- ===================================================================================== -->
  <white-sheet class="mt-5 the-wrapper-dapp">
    <!-- ===================================================================================== -->
    <!-- Mew Banner - props: bannerText, bannerImg -->
    <!-- TODO: Add block header to mew banner component -->
    <!-- ===================================================================================== -->
    <the-dapp-block-header
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
    </the-dapp-block-header>

    <!-- ===================================================================================== -->
    <!-- NER DAPP HEADER: -->
    <!-- ===================================================================================== -->
    <the-dapp-header
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

<script>
import bannerImage from '@/assets/images/backgrounds/bg-dapps-center.jpg';
import TheDappBlockHeader from './TheDappBlockHeader';
import TheDappHeader from './TheDappHeader';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { mapGetters } from 'vuex';
export default {
  components: { TheDappBlockHeader, TheDappHeader },
  props: {
    // OLD
    hasExitBtn: {
      default: false,
      type: Boolean
    },
    // OLD
    bannerImg: {
      default: bannerImage,
      type: String
    },
    /**
     * NEW Banner Text:
     * bannerText: {
     *     title: 'ETH Blocks', //
     *     subtext: 'Mint stunning QR art-pieces based on your favorite blocks.'
     * }
     */
    bannerText: {
      default: () => {},
      type: Object
    },
    /**
     * NEW TAB ITEMS OBJECT SHOULD LOOK LIKE THIS:
     * tabItems:
     *   [{
     *      name: 'Mint a new block',                      // String that will be displayd as a tab menu
     *      route: { name: ETH_BLOCKS_ROUTE.CORE.NAME },   // Route name of the child
     *    }]
     */
    tabItems: {
      default: () => [],
      type: Array
    },
    // USED ALSE IN NEW TAB MENU
    activeTab: {
      default: 0,
      type: Number
    },
    // OLD
    titleIcon: {
      default: '',
      type: String
    },
    // OLD
    noBackBtn: {
      default: false,
      type: Boolean
    },
    // OLD
    topStrip: {
      default: false,
      type: Boolean
    },
    // OLD
    onTab: {
      default: () => {},
      type: Function
    },
    // OLD
    hideDefaultTabHeader: {
      default: false,
      type: Boolean
    },
    /** NEW ITEMS FOR UPDATED WRAPPER
     * NOTE: REFACTOR NEEDED FOR OTHER DAPPS: you can remove all older menu and items
     */
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
  },
  data() {
    return {
      bannerTextObj: {}
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    isValidNetwork() {
      const chainID = this.network.type.chainID;
      const validChain = this.validNetworks.filter(
        item => item.chainID === chainID
      );
      return validChain.length > 0;
    },
    networkAlertText() {
      const names = this.validNetworks.map(item => item.name_long).join(', ');
      const netString = this.validNetworks.length > 1 ? 'networks' : 'network';
      return `Please select ${names} ${netString} to use this Dapp.`;
    }
  },

  mounted() {
    this.bannerTextObj = this.bannerText;
    if (this.hasExitBtn) {
      this.bannerTextObj.exit = this.$t('common.exit-dapp');
    }
  },
  methods: {
    onClose() {
      this.$router.push({
        name: 'Dapps'
      });
    },
    routeToTab(route) {
      try {
        this.$router.push(route);
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
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
