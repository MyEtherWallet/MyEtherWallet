<template>
  <!--
  =====================================================================================
    Mew Alert
  =====================================================================================
  -->
  <v-alert
    class="mew-alert mb-0 bs-small"
    :class="[alertClasses, hideAlertIcon ? 'pl-7' : 'pl-4', 'py-3 pr-5']"
    colored-border
    :color="alertColor"
    border="left"
    :icon="alertIcon"
    dismissible
  >
    <!--
  =====================================================================================
   Title + Description + LinkObject
  =====================================================================================
  -->
    <div :class="[hideAlertIcon ? '' : 'pl-1']">
      <span v-if="title" class="mew-body font-weight-bold textDark--text">{{
        title
      }}</span>
      <div v-if="description" class="mew-body textDark--text">
        {{ description }}
        <a
          v-if="linkObject"
          target="_blank"
          class="textDark--text text-decoration-underline"
          :href="linkObject.url"
          >{{ linkObject.text }}</a
        >
      </div>
      <!--
  =====================================================================================
   slot: default (should be used if there is no text or description prop)
  =====================================================================================
  -->
      <slot />
    </div>
    <!--
  =====================================================================================
   Close Button 
   TODO: change this to mew-icon component after icon buttons are finalized.
  =====================================================================================
  -->
    <template #close="{ toggle }">
      <v-btn v-if="!hideCloseIcon" class="close-btn" icon @click="toggle">
        <v-icon :color="alertColor" size="16" class="pa-1"> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-alert>
</template>

<script>
export default {
  name: 'MewAlert',
  props: {
    /**
     * Applies the theme: error, warning, success, info
     */
    theme: {
      type: String,
      default: 'info'
    },
    /**
     * Sets a white background for the entire alert.
     */
    hasWhiteBackground: {
      type: Boolean,
      default: false
    },
    /**
     * Hides top left icon.
     */
    hideAlertIcon: {
      type: Boolean,
      default: false
    },
    /**
     * Hides close button.
     */
    hideCloseIcon: {
      type: Boolean,
      default: false
    },
    /**
     * Adds a title to the alert.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Adds a description to the alert.
     */
    description: {
      type: String,
      default: ''
    },
    /**
     * Expects a link object with attributes text and url, i.e { url: 'www.myetherwallet.com', text: 'Home" }
     * This is added at the end of description.
     */
    linkObject: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      /**
       * all theme options
       */
      themes: {
        error: 'error',
        warning: 'warning',
        success: 'success',
        info: 'info'
      }
    };
  },
  computed: {
    /**
     * @returns if its an error theme.
     */
    isErrorTheme() {
      return this.theme.toLowerCase() === this.themes.error;
    },
    /**
     * @returns if its an info theme.
     */
    isInfoTheme() {
      return this.theme.toLowerCase() === this.themes.info;
    },
    /**
     * @returns if its a warning theme.
     */
    isWarningTheme() {
      return this.theme.toLowerCase() === this.themes.warning;
    },
    /**
     * @returns if its a success theme.
     */
    isSuccessTheme() {
      return this.theme.toLowerCase() === this.themes.success;
    },
    /**
     * @returns the alert border color.
     */
    alertColor() {
      if (this.isWarningTheme) {
        return 'orangePrimary';
      }
      if (this.isInfoTheme) {
        return 'bluePrimary';
      }
      if (this.isErrorTheme) {
        return 'redPrimary';
      }
      if (this.isSuccessTheme) {
        return 'greenPrimary';
      }
      return this.theme;
    },
    /**
     * @returns the alert icon. Will not show if hideAlertIcon is true.
     */
    alertIcon() {
      if (this.hideAlertIcon) {
        return null;
      }
      if (this.isWarningTheme) {
        return 'mdi-alert';
      }
      if (this.isInfoTheme) {
        return 'mdi-information';
      }
      if (this.isErrorTheme) {
        return 'mdi-close-circle';
      }
      return 'mdi-checkbox-marked-circle';
    },
    /**
     * @returns specific mew alert classes. Used for styling.
     */
    alertClasses() {
      const classes = [];
      if (this.hasWhiteBackground) {
        classes.push('white');
      }
      if (this.isWarningTheme) {
        classes.push('orangeLight');
      }
      if (this.isInfoTheme) {
        classes.push('blueLight');
      }
      if (this.isErrorTheme) {
        classes.push('redLight');
      }
      if (this.isSuccessTheme) {
        classes.push('greenLight');
      }
      return classes;
    }
  }
};
</script>

<style lang="scss" scoped>
/**
  * MEW ALERT STYLES
  */
.mew-alert {
  border-radius: 8px;
  .close-btn {
    height: auto;
    width: auto;
  }
}
</style>
