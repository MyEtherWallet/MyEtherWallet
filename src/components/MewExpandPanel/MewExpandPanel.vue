<template>
  <!--
  =====================================================================================
    Mew Expand Panel
  =====================================================================================
  -->
  <v-expansion-panels
    :value="expandIdxArr"
    :accordion="isAccordion"
    multiple
    :class="expandPanelsClasses"
    :flat="true"
  >
    <v-expansion-panel
      v-for="(item, i) in panelItems"
      :key="i"
      :class="!isAccordion ? 'mb-2' : ''"
    >
      <!--
    =====================================================================================
      Panel Header 
    =====================================================================================
    -->
      <v-expansion-panel-header
        :class="['pa-5']"
        :color="isGreyTheme ? 'greyLight' : 'whiteAlways'"
      >
        <!--
    =====================================================================================
      Panel Header - Left 
    =====================================================================================
    -->
        <div
          class="d-flex align-center mew-body font-weight-medium textDark--text"
        >
          {{ item.name }}
        </div>
        <!--
    =====================================================================================
      Panel Header - Right
    =====================================================================================
    -->
        <div slot="actions" class="d-flex align-center justify-center">
          <span
            :class="[
              'mew-body mr-5 text-right',
              isGreyTheme ? 'textMedium--text' : 'textLight--text'
            ]"
            >{{ item.toggleTitle }}</span
          >
          <!--
  =====================================================================================
    Chevron icon to toggle expand
  =====================================================================================
  -->
          <v-icon
            v-if="!isExpanded(i)"
            :color="isGreyTheme ? 'textMedium' : 'textLight'"
          >
            mdi-chevron-down
          </v-icon>
          <v-icon v-else :color="isGreyTheme ? 'textMedium' : 'textLight'">
            mdi-chevron-down
          </v-icon>
        </div>
      </v-expansion-panel-header>
      <!--
  =====================================================================================
    Panel Content, has slot: 'panelBody' + the number of the panel (used to place content in the panel body)
  =====================================================================================
  -->
      <v-expansion-panel-content color="white">
        <slot :name="'panelBody' + (i + 1)" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  name: 'MewExpandPanel',
  props: {
    /**
     * Takes an array of panel indexes and
     * will expand the panel indexes found in the array.
     */
    idxToExpand: {
      type: Array,
      default: () => [0]
    },
    /**
     * Accepts an array of panel objects, i.e [{ name: '', toggleTitle: '' }]
     */
    panelItems: {
      type: Array,
      default: () => []
    },
    /**
     * Sets a grey background and border.
     */
    isGreyTheme: {
      type: Boolean,
      default: false
    },
    /**
     * Removes margins between the panels
     * if nothing is passed then there will be 8px margin in between panels (split)
     */
    isAccordion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expandIdxArr: []
    };
  },
  computed: {
    /**
     * @returns classes for expand panel - needed for styling
     */
    expandPanelsClasses() {
      const classes = ['mew-expand-panel', 'rounded-lg'];
      this.isGreyTheme
        ? classes.push('grey-theme')
        : classes.push('white-theme');
      if (!this.isAccordion) {
        classes.push('split-panels');
      }
      return classes;
    }
  },
  watch: {
    /**
     * @watches idxToExpand to ensure the correct panel is expanded
     */
    idxToExpand(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.expandIdxArr = newVal;
      }
    }
  },
  mounted() {
    /**
     * on mount, will assign prop idxToExpand to expandIdxArr (so we can manipulate the data)
     */
    this.expandIdxArr = this.idxToExpand;
  },
  methods: {
    /**
     * @returns if the panel is expanded
     */
    isExpanded(idx) {
      if (Array.isArray(this.expandIdxArr) && this.expandIdxArr.includes(idx)) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
/**
  *  MEW EXPAND STYLES
  */
.mew-expand-panel {
  // grey theme + split panels border styles
  &.split-panels {
    &.grey-theme {
      .v-expansion-panel {
        border: 1px solid var(--v-greyMedium-base);
        border-radius: 8px;
        .v-expansion-panel-header {
          border-radius: 8px;
        }
        .v-expansion-panel-content {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        &.v-expansion-panel--active {
          .v-expansion-panel-header {
            border-radius: 0;
          }
        }
      }
    }
  }
  // grey theme + accordion panel border styles
  &.v-expansion-panels--accordion {
    &.grey-theme {
      .v-expansion-panel {
        .v-expansion-panel-header {
          border: 1px solid var(--v-greyMedium-base);
          border-bottom: none;
          border-color: var(
            --v-greyMedium-base
          ) !important; // adding this to override vuetify
        }
        // adds border to expand content
        .v-expansion-panel-content {
          border-color: var(
            --v-greyMedium-base
          ) !important; // adding this to override vuetify
          border-left: 1px solid var(--v-greyMedium-base);
          border-right: 1px solid var(--v-greyMedium-base);
        }
      }
      // adds bottom border to last panel
      .v-expansion-panel:last-child {
        .v-expansion-panel-header {
          border-bottom: 1px solid var(--v-greyMedium-base);
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        // adds border to last expand panel content
        .v-expansion-panel-content {
          border-bottom: 1px solid var(--v-greyMedium-base);
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
      // removes bottom radius for last panel when active
      .v-expansion-panel--active {
        &.v-expansion-panel:last-child {
          .v-expansion-panel-header {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
      }
    }
  }
  // white theme + split panels border styles
  &.split-panels {
    &.white-theme {
      .v-expansion-panel {
        border: 1px solid var(--v-greyMedium-base);
        border-radius: 8px;
        .v-expansion-panel-header {
          border-radius: 8px;
        }
      }
      .v-expansion-panel-content {
        border-radius: 8px;
      }
    }
  }
  // white theme + accordion panel border styles
  &.v-expansion-panels--accordion {
    &.white-theme {
      .v-expansion-panel {
        border: 1px solid var(--v-greyMedium-base);
        border-bottom: none;
      }
      .v-expansion-panel:last-child {
        border-bottom: 1px solid var(--v-greyMedium-base);
        .v-expansion-panel-header {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
      .v-expansion-panel--active {
        .v-expansion-panel-content {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
// removes padding for expand panel content
// needs to be global to override vuetify style
.v-expansion-panel {
  .v-expansion-panel-content__wrap {
    padding: 0;
  }
}
</style>
