<template>
  <!--
=====================================================================================
  Mew Tabs 
=====================================================================================
-->
  <div>
    <v-tabs
      :class="tabClasses"
      :background-color="background"
      :color="activeColor"
      :centered="isCentered"
      slider-size="3"
      v-model="onTab"
      :hide-slider="isBlock || isVertical"
      :grow="isBlock || hasFullWidth"
      :vertical="isVertical"
      :show-arrows="showArrows"
      :align-with-title="!isBlock && !isCentered && !isVertical"
    >
      <v-tab
        :class="[
          isBlock
            ? 'mew-tab-block'
            : isVertical || isSmall
              ? 'mew-body font-weight-medium'
              : 'mew-heading-2',
          'capitalize',
        ]"
        :ripple="!isVertical"
        v-for="(item, i) in items"
        :key="item + i"
      >
        {{ item.name }}
      </v-tab>
      <v-tabs-items v-model="onTab">
        <v-tab-item
          :reverse-transition="
            !isVertical ? 'slide-x-transition' : 'slide-y-transition'
          "
          v-for="(item, i) in items"
          :key="item + i"
        >
          <!--
=====================================================================================
  Slot: 'tabItemContent' + number of tab content (used to place custom tab content 
  inside of the tab container)
=====================================================================================
-->
          <slot :name="'tabItemContent' + (i + 1)" />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <div
      v-for="(item, i) in items"
      :key="item + i"
    >
      <v-slide-x-reverse-transition
        :hide-on-leave="true"
        mode="out-in"
      >
        <!--
=====================================================================================
  Slot: 'tabContent' + number of tab content (used to place custom tab content outside of the 
  tab container)
=====================================================================================
-->
        <slot
          v-if="onTab === i"
          :name="'tabContent' + (i + 1)"
        />
      </v-slide-x-reverse-transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MewTabs',
  data() {
    return {
      onTab: null,
    };
  },
  props: {
    /**
     * Sets the color for active tab.
     * If nothing passed, titlePrimary will be used.
     */
    activeColor: {
      type: String,
      default: 'titlePrimary',
    },
    /**
     * Sets the color for the background of mew-tabs.
     * If nothing passed, transparent will be used.
     */
    background: {
      type: String,
      default: 'transparent',
    },
    /**
     * Displays arrows if tab items overflow container.
     */
    showArrows: {
      type: Boolean,
      default: false,
    },
    /**
     * Sets the active tab.
     */
    activeTab: {
      type: Number,
      default: 0,
    },
    /**
     * Sets the tabs as vertical.
     */
    hasUnderline: {
      type: Boolean,
      default: false,
    },
    /**
     * Sets the tabs as vertical.
     */
    isVertical: {
      type: Boolean,
      default: false,
    },
    /**
     * Sets the tabs to the center of the page.
     */
    isCentered: {
      type: Boolean,
      default: false,
    },
    /**
     * Tab content
     */
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /**
     * Shows the tab as a block.
     */
    isBlock: {
      type: Boolean,
      default: false,
    },
    /**
     * Allows tabs to take up the full-width of the page.
     */
    hasFullWidth: {
      type: Boolean,
      default: false,
    },
    /**
     * Sets the font size to 14px (mew-body)
     */
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tabClasses() {
      const classes = ['mew-tabs'];
      if (this.hasUnderline) {
        classes.push('mew-tabs-underline');
      }
      if (this.isBlock) {
        classes.push('mew-tabs-block elevation-3');
      }
      return classes;
    },
  },
  methods: {
    onClick() {
      this.$emit('onNextStep');
    },
  },
  mounted() {
    this.onTab = this.activeTab;
  },
  watch: {
    activeTab(newVal) {
      this.onTab = newVal;
    },
    onTab(newVal) {
      this.$emit('onTab', newVal);
    },
  },
};
</script>

<style lang="scss">
.mew-tabs-underline {
  .v-slide-group__content {
    border-bottom: 1px solid var(--v-inputBorder-base);
  }
}
.mew-tabs-block {
  border-radius: 12px !important;

  .mew-tab-block {
    background-color: var(--v-white-base);
    color: var(--v-basic-base) !important;
  }

  .v-tab--active {
    background: var(--v-basic-base);
    color: var(--v-white-base) !important;
  }

  .mew-tab-block:first-of-type {
    border-radius: 12px 0px 0px 12px;
  }

  .mew-tab-block:last-of-type {
    border-radius: 0px 12px 12px 0px;
  }
}

.mew-tabs {
  &.v-tabs--vertical > .v-tabs-bar .v-tab {
    display: flex;
    justify-content: start;
    padding-left: 0;
    &:hover {
      text-decoration: underline;
    }
    &:before {
      background-color: transparent;
    }
  }
}
</style>
