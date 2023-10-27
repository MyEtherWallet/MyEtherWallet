<template>
  <!--
  =====================================================================================
    Mew Dropdown
  =====================================================================================
  -->
  <v-menu
    v-model="isDropdownOpen"
    max-height="520"
    content-class="mew-dropdown-content-class"
    offset-y
    :close-on-content-click="false"
    left
  >
    <template #activator="{ on }">
      <!--
  =====================================================================================
    Button to activate popup content
    slot: activatorBtnText (used to place custom text on activator button)
  =====================================================================================
  -->
      <v-btn
        elevation="0"
        color="rgba(109, 137, 166, 0.08)"
        height="36"
        class="py-2 px-4"
        v-on="on"
      >
        <slot name="activatorBtnText" />
      </v-btn>
    </template>
    <!--
  =====================================================================================
    Popup content
  =====================================================================================
  -->
    <v-card width="380" color="white" class="pa-0">
      <!--
      =====================================================================================
        Popup Header
        =====================================================================================
      -->
      <v-card-title class="pl-8 pt-8 pb-0 rounded-lg">
        <div v-if="popupTitle" class="mew-heading-2 break-word">
          {{ popupTitle }}
        </div>
        <v-btn icon color="rgba(32, 33, 36, 0.4)" class="header-close-icon">
          <v-icon size="x-large" color="rgba(32, 33, 36, 0.4);" @click="close">
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <!--
      =====================================================================================
        Popup Body
        slot: cardContent (used to place custom content in card popup)
      =====================================================================================
      -->
      <v-card-text class="pa-8 full-width full-height">
        <slot name="cardContent" />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'MewMenu',
  props: {
    /**
     * Popup title.
     */
    popupTitle: {
      type: String,
      default: ''
    },
    /**
     * Opens the popup dropdown if true.
     */
    isOpened: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDropdownOpen: false
    };
  },
  watch: {
    isOpened(newVal) {
      this.isDropdownOpen = newVal;
    }
  },
  mounted() {
    this.isDropdownOpen = this.isOpened;
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
</style>
