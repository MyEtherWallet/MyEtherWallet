<template>
  <div>
    <v-sheet 
      :class="[ hasElevation ? 'elevation-2' : '']"
      :color="colorType"
      height="100%"
    >
      <v-container class="header-wrapper">
        <v-row
          align="center"
          justify="space-between"
        >
          <div :class="['left-wrapper', 'pl-10', 'd-flex', 'flex-row', 'justify-center', 'align-center', hasIndicator ? 'indicator' : '']">
            <div class="left-icon mr-2">
              <img
                v-if="showIcon(icon) && iconAlign.toLowerCase() === iconAlignments.left"
                :src="icon"
                alt="left icon"
              >
            </div>
            <div class="d-flex flex-column">
              <span class="mew-heading-3 textPrimary--text text-uppercase">{{ subtitle }}</span>
              <span :class="['titlePrimary--text', titleSize]">{{ title }}</span>
              <span class="mew-body textSecondary--text font-weight-bold">{{ caption }}</span>
            </div>
            <div class="right-icon">
              <img
                v-if="showIcon(icon) && iconAlign.toLowerCase() === iconAlignments.right"
                :src="icon"
                alt="right icon"
              >
            </div>
            <slot name="leftHeaderContainer" />
          </div>
          <div class="right-wrapper pr-10 pt-2">
            <slot name="rightHeaderContainer" />
          </div>
        </v-row>  
        <v-row
          align="center"
          justify="center"
        >
          <slot name="moduleBody" />
        </v-row> 
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
        iconAlignments: {
        left: 'left',
        right: 'right'
      },
    }
  },
  props: {
    /**
     * The icon url. Inserts an icon next to the title.
     */
    icon: {
      type: [ String, Array],
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
      default: ''
    },
    /**
     * The title of the module.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * The subtitle of the module.
     */
    subtitle: {
      type: String,
      default: ''
    },
    /**
     * The caption of the module.
     */
    caption: {
      type: String,
      default: ''
    },
    /**
     * Title size class.
     */
    titleSize: {
      type: String,
      default: 'mew-heading-1'
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
    }
  },
  methods: {
    showIcon(src) {
      if (src === '' || src.length <= 0 ) {
        return false;
      }
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>
.indicator {
  border-left: 4px solid var(--v-primary-base);
}
</style>