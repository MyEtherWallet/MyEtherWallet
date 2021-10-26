<template>
  <!--
  =====================================================================================
    TEMP Mew Dropdown update
  =====================================================================================
  -->
  <v-menu
    max-height="520"
    content-class="mew-dropdown-content-class"
    offset-y
    left
    v-model="isDropdownOpen"
    open-on-click
  >
    <template #activator="{ on, attrs }">
      <mew-button
        :has-full-width="$vuetify.breakpoint.mdAndUp"
        color-theme="basic"
        height="36"
        btn-style="light"
        btn-size="medium"
        class="px-0"
        v-bind="attrs"
        v-on="on"
        @click.native="isDropdownOpen = !isDropdownOpen"
      >
        <div
          class="
            d-flex
            flex-row
            px-3
            align-center
            width--full
            justify-space-between
          "
        >
          <slot name="activatorBtnText" />
          <v-icon v-if="hasIcon" class="textMedium--text text-end"
            >mdi-menu-down
          </v-icon>
        </div>
      </mew-button>
    </template>
    <!--
  =====================================================================================
    Popup content
  =====================================================================================
  -->
    <v-card color="white" class="pa-0 rounded">
      <!--
      =====================================================================================
        Popup Header
        =====================================================================================
      -->
      <v-card-title v-if="popupTitle || hasClose" class="pl-8 pt-8 pb-0">
        <div v-if="popupTitle" class="mew-heading-2 break-word">
          {{ popupTitle }}
        </div>
        <v-btn
          v-if="hasClose"
          icon
          color="rgba(32, 33, 36, 0.4)"
          class="header-close-icon"
        >
          <v-icon size="x-large" color="rgba(32, 33, 36, 0.4);" @click="close">
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <!--
      =====================================================================================
        Popup Body
      =====================================================================================
      -->
      <v-card-text class="py-4 px-0 full-width full-height">
        <slot name="cardContent" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'BlocksDropwDownMenu',

  props: {
    /**
     * Popup width
     */
    popupWidth: {
      type: String,
      default: '380'
    },
    /**
     * Popup title
     */
    popupTitle: {
      type: String,
      default: ''
    },
    /**
     * Controls if the popup dropdown is opened or closed.
     */
    isOpened: {
      type: Boolean,
      default: false
    },

    hasClose: {
      type: Boolean,
      defualt: true
    },

    hasIcon: {
      type: Boolean,
      defualt: false
    }
  },
  data() {
    return {
      isDropdownOpen: false
    };
  },
  methods: {
    close() {
      this.isDropdownOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.header-close-icon {
  right: 10px;
  top: 10px;
  position: absolute;
}
.mew-dropdown-content-class {
  border: none;
  box-shadow: 0px 12px 12px rgba(11, 40, 64, 0.04),
    0px 6px 26px rgba(11, 40, 64, 0.06), 0px 4px 48px rgba(11, 40, 64, 0.04);
}
.full-width {
  width: 100% !important;
}

.border-radius--12px {
  border-radius: 12px !important;
}
</style>
