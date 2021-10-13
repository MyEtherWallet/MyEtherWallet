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
    <the-dapp-header v-else />

    <!--
    =====================================================================================
      Mew Tabs - props: tabItems, activeTab; takes in a slot for each
      tab content (tabContent + tab number )
      TODO: remove hideDefaultTabHeader prop and refactor
    =====================================================================================
    -->
    <mew-tabs
      v-if="tabItems.length > 0"
      :class="['pt-5', hideDefaultTabHeader ? 'hide-default-tab-header' : '']"
      :items="tabItems"
      :is-centered="true"
      :active-tab="activeTab"
      has-underline
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
export default {
  components: { BlockHeader, TheDappHeader },
  props: {
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
    }
  },
  data() {
    return {
      bannerTextObj: {}
    };
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
</style>
