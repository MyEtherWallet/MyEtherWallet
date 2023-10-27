<template>
  <!--
  =====================================================================================
    Mew Module
  =====================================================================================
  -->
  <v-sheet
    :class="[
      hasElevation ? 'module-box-shadow' : '',
      'full-width',
      'module-container pt-8'
    ]"
    :color="colorType"
    :height="hasFullHeight ? '100%' : 'auto'"
  >
    <!--
  =====================================================================================
    Module header
  =====================================================================================
  -->
    <v-container fluid>
      <v-row align="center" justify="space-between">
        <div
          :class="[
            'left-wrapper pl-8 mt-2 d-flex flex-row',
            hasBodyPadding
              ? 'justify-start align-end pt-6'
              : 'justify-center align-center',
            hasIndicator ? 'indicator pl-md-13' : ''
          ]"
        >
          <div v-if="showIcon(icon)" class="left-icon mr-2">
            <mew-token-container
              v-if="iconAlign.toLowerCase() === iconAlignments.left"
              :img="icon"
              size="large"
              alt="left icon"
            />
          </div>
          <div class="d-flex flex-column">
            <span
              v-if="subtitle"
              class="mew-heading-3 textPrimaryModule--text text-uppercase"
              >{{ subtitle }}</span
            >
            <span
              v-if="title"
              :class="['titlePrimary--text d-flex align-center', titleSize]"
              >{{ title }}
              <mew-tooltip
                v-if="mewTooltipText"
                class="mb-1 ml-1"
                :text="mewTooltipText"
            /></span>
            <span
              v-if="caption"
              class="mew-body textSecondaryModule--text font-weight-bold"
              >{{ caption }}</span
            >
          </div>
          <div v-if="showIcon(icon)" class="right-icon">
            <mew-token-container
              v-if="iconAlign.toLowerCase() === iconAlignments.right"
              :img="icon"
              size="large"
              alt="right icon"
            />
          </div>
          <!--
  =====================================================================================
    Slot: leftHeaderContainer (used to place custom ui on the left)
  =====================================================================================
  -->
          <slot name="leftHeaderContainer" />
        </div>
        <div class="right-wrapper pr-10 pt-2">
          <!--
  =====================================================================================
    Slot: rightHeaderContainer (used to place custom ui on the right)
  =====================================================================================
  -->
          <slot name="rightHeaderContainer" />
        </div>
      </v-row>
      <!--
  =====================================================================================
    Module Body
  =====================================================================================
  -->
      <v-row align="center" justify="center">
        <!--
  =====================================================================================
    Slot: moduleBody (used to place custom ui on the body content)
  =====================================================================================
  -->
        <v-container
          :class="hasBodyPadding ? 'pa-6 pb-13 px-md-13 py-md-8' : 'pa-0'"
          fluid
        >
          <slot name="moduleBody" />
        </v-container>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import MewTooltip from '@/components/MewTooltip.vue';
import MewTokenContainer from '@/components/MewTokenContainer.vue';

export default {
  name: 'MewModule',
  components: {
    MewTooltip,
    MewTokenContainer
  },
  props: {
    /**
     * The icon url. Inserts an icon next to the title.
     */
    icon: {
      type: [String, Array],
      default: ''
    },
    /**
     * Aligns the icon: left, right, or none.
     */
    iconAlign: {
      type: String,
      default: 'none'
    },
    /**
     * Background color
     */
    colorType: {
      type: String,
      default: 'bgWalletBlock'
    },
    /**
     * The module title.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * The module subtitle.
     */
    subtitle: {
      type: String,
      default: ''
    },
    /**
     * The module caption.
     */
    caption: {
      type: String,
      default: ''
    },
    /**
     * The mew tooltip text.
     */
    mewTooltipText: {
      type: String,
      default: ''
    },
    /**
     * Title size class.
     */
    titleSize: {
      type: String,
      default: 'mew-heading-2'
    },
    /**
     * Displays indicator.
     */
    hasIndicator: {
      type: Boolean,
      default: false
    },
    /**
     * Adds elevation to the module.
     */
    hasElevation: {
      type: Boolean,
      default: false
    },
    /**
     * Adjusts the module to 100% height.
     */
    hasFullHeight: {
      type: Boolean,
      default: false
    },
    /**
     * Adds padding to the body container.
     */
    hasBodyPadding: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      iconAlignments: {
        left: 'left',
        right: 'right'
      }
    };
  },
  methods: {
    showIcon(src) {
      if (src === '' || src.length <= 0) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.module-container {
  border-radius: 12px;
  &.module-box-shadow {
    box-shadow: 0 12px 17px rgb(21 29 63 / 3%) !important;
  }
  .indicator {
    border-left: 4px solid var(--v-primary-base);
    height: 24px;
  }
}
</style>
