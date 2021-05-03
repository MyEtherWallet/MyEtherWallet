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
      TODO: we currently do not have all the custom dapp banner images, so will use the default for
      now if there is none available.
    =====================================================================================
    -->
    <mew-banner
      :text-obj="bannerTextObj"
      :banner-img="bannerImg"
      @closeBanner="onClose"
    />
    <!--
    =====================================================================================
      Mew Tabs - props: tabItems, activeTab; takes in a slot for each 
      tab content (tabContent + tab number )
    =====================================================================================
    -->
    <mew-tabs
      v-if="tabItems.length > 0"
      class="pt-5"
      :items="tabItems"
      :is-centered="true"
      :active-tab="activeTab"
      has-underline
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

export default {
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
