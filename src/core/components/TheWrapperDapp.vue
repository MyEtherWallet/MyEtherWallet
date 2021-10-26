<template>
  <!--
  =====================================================================================
    DAPP WRAPPER:
  =====================================================================================
  -->
  <mew6-white-sheet>
    <!--
    =====================================================================================
      Mew Banner - props: bannerText, bannerImg
      TODO: Add block header to mew banner component
    =====================================================================================
    -->
    <block-header
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
    </block-header>
    <!--
    =====================================================================================
     NER DAPP HEADER:
    =====================================================================================
    -->
    <the-dapp-header
      v-else
      :dapp-name="bannerText.title"
      :dapp-text="bannerText.subtext"
      :dapp-img="dappImg"
    />

    <!--
    =====================================================================================
      Mew Tabs - props: tabItems, activeTab; takes in a slot for each
      tab content (tabContent + tab number )
      TODO: remove hideDefaultTabHeader prop and refactor
    =====================================================================================
    -->
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
      :background="transparent"
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
    <!--
    =====================================================================================
      NEW menu Tabs - props: tabItems, activeTab; takes in a slot for each
      tab content (tabContent + tab number )
      TODO: remove hideDefaultTabHeader prop and refactor
    =====================================================================================
    -->
    <v-tabs
      v-if="tabItems.length > 0 && isNewHeader"
      v-model="tab"
      background-color="backgroundGrey"
      color="blue500"
      height="46"
    >
      <v-tab
        v-for="(item, index) in tabItems"
        :key="item.name"
        :to="item.route"
        :class="[
          'px-4 px-md-10 textMedium--text  menu-tab-text mew-body',
          { 'ml-3 ml-md-13': index === 0 },
          { 'mr-3 mr-md-13': index + 1 === tabItems.length }
        ]"
        active-class="blue500--text"
      >
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <!--
    =====================================================================================
     NEW ROUTER VIEW: FOR is NEW HEADER (specify in dapp metaInfo)
    =====================================================================================
    -->
    <router-view v-if="tabItems.length > 0 && isNewHeader && isValidNetwork" />
    <div v-if="tabItems.length > 0 && isNewHeader && !isValidNetwork">
      <p>Not valid Network</p>
    </div>
    <!--
    =====================================================================================
     Slot: content, used to place body content if not using tabs.
    =====================================================================================
    -->
    <div v-if="tabItems.length === 0" class="pt-8 px-3 pa-md-8">
      <slot name="content" />
    </div>
  </mew6-white-sheet>
</template>

<script>
import bannerImage from '@/assets/images/backgrounds/bg-dapps-center.png';
import BlockHeader from '@/core/components/AppBlockHeader';
import TheDappHeader from '@/core/components/TheDappHeader';
import { mapGetters } from 'vuex';
export default {
  components: { BlockHeader, TheDappHeader },
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
    // OLD
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
    }
  },
  data() {
    return {
      bannerTextObj: {},
      tab: null
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
    }
  }
};
</script>

<style lang="scss">
.hide-default-tab-header {
  .v-tabs {
    display: none;
  }
}
.menu-tab-text {
  text-transform: none !important;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
