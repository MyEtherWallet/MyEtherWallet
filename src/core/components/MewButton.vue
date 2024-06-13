<template>
  <!-- ===================================================================================== -->
  <!-- Mew Button -->
  <!-- ===================================================================================== -->
  <v-btn
    :target="btnLink ? '_blank' : ''"
    :href="btnLink"
    :class="[buttonClasses, 'mew-button']"
    :color="buttonColor"
    :disabled="disabled"
    :loading="loading"
    depressed
    :outlined="hasOutline"
    :text="isTransparent"
  >
    <!-- ===================================================================================== -->
    <!-- Loaded Button Content -->
    <!-- ===================================================================================== -->
    <div
      :class="[
        hasFullWidth ? 'full-width' : '',
        'd-flex justify-center align-center'
      ]"
    >
      <!-- ===================================================================================== -->
      <!-- Button text (if no title prop is passed, then slot should be used) -->
      <!-- ===================================================================================== -->
      <span v-if="title" class="font-weight-regular reset-text-style">
        {{ title }}
      </span>
      <!-- ===================================================================================== -->
      <!-- slot: default -->
      <!-- ===================================================================================== -->
      <slot />
    </div>
  </v-btn>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  /**
   * Enables loading state
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * Button sizes: small, medium, large, xlarge.
   */
  btnSize: {
    type: String,
    default: 'large'
  },
  /**
   * Sets the button at 100% width.
   */
  hasFullWidth: {
    type: Boolean,
    default: false
  },
  /**
   * Applies the button style: background, light, transparent, or outline.
   * If nothing is passed then the button will be the
   * default standard background color theme.
   */
  btnStyle: {
    type: String,
    default: 'background'
  },
  /**
   * The text that will be displayed at the center of the button.
   * If not passed, a slot should be used.
   */
  title: {
    type: String,
    default: ''
  },
  /**
   * Applies the button color theme: primary, secondary, basic, error, white.
   */
  colorTheme: {
    type: String,
    default: 'primary'
  },
  /**
   * Removes the ability to click or target the component.
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Designates that the component is a link.
   * when clicked, the link will open up a new page.
   */
  btnLink: {
    type: String,
    default: ''
  }
});

// data
const colorThemes = {
  secondary: 'secondary',
  primary: 'primary',
  basic: 'basic',
  error: 'error'
};

const btnStyles = {
  light: 'light',
  transparent: 'transparent',
  outline: 'outline',
  background: 'background'
};

// computed
const isPrimaryTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.primary;
});

const isSecondaryTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.secondary;
});

const isBasicTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.basic;
});

const isErrorTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.error;
});

const buttonColor = computed(() => {
  // SECONDARY COLORS
  if (isLight.value && isSecondaryTheme.value) {
    return 'rgba(75, 128, 233, 0.08)';
  }

  if (isSecondaryTheme.value) {
    return 'bluePrimary';
  }

  // ERROR COLORS
  if (isLight.value && isErrorTheme.value) {
    return 'rgba(255, 68, 91, 0.08)';
  }

  if (isErrorTheme.value) {
    return 'redPrimary';
  }

  // PRIMARY COLORS
  if (isPrimaryTheme.value && isLight.value) {
    return 'buttonGrayLight';
  }

  if (isPrimaryTheme.value) {
    return 'greenPrimary';
  }

  // BASIC THEME COLORS
  if (isBasicTheme.value && isLight.value) {
    return 'greyLight';
  }

  if (isBasicTheme.value) {
    return 'greyPrimary';
  }

  return props.colorTheme;
});

const buttonClasses = computed(() => {
  const classes = [];
  // adds btn size
  if (props.btnSize.toLowerCase()) {
    classes.push(props.btnSize.toLowerCase() + '-btn');
  }

  // adds 100% full width
  if (props.hasFullWidth === true) {
    classes.push('full-width');
  }

  // adds correct button color text
  if (!props.disabled) {
    if (isPrimaryTheme.value && isLight.value) {
      classes.push('greenPrimary--text');
    }

    if (isErrorTheme.value && isLight.value) {
      classes.push('redPrimary--text');
    }

    if (isSecondaryTheme.value && isLight.value) {
      classes.push('bluePrimary--text');
    }

    if (isBasicTheme.value && isLight.value) {
      classes.push('greyPrimary--text');
    }
  }
  // adds white text for all default backgrounds
  if (isBackground.value) {
    classes.push('white--text');
  }

  // adds class for disabled and btn style
  if (props.disabled) {
    classes.push('disabled-' + props.btnStyle.toLowerCase());
  }

  // adds class for btn style
  if (props.btnStyle.toLowerCase()) {
    classes.push('btn-' + props.btnStyle.toLowerCase());
  }

  return classes;
});

const isTransparent = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.transparent;
});

const hasOutline = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.outline;
});

const isLight = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.light;
});

const isBackground = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.background;
});
</script>

<style lang="scss" scoped>
// Adding full width to the container itself
.reset-text-style {
  text-transform: none;
}
.full-width {
  width: 100%;
}
// MEW BUTTON STYLES
.v-application {
  .v-btn.mew-button {
    letter-spacing: 0.5px;

    text-transform: none;

    border-radius: 10px !important;
    // BUTTON SIZES
    &.small-btn {
      padding: 8px;
    }

    &.medium-btn {
      padding: 0 20px;
    }

    &.large-btn {
      height: 46px;
      padding: 0 20px;
    }

    &.xlarge-btn {
      height: 62px;
      padding: 0 46px;
    }

    /**
    * PRIMARY COLOR THEME 
    */
    // btn style: default background - active & hover states
    &.greenPrimary.btn-background.white--text:hover {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.08),
          rgba(255, 255, 255, 0.08)
        ),
        #05c0a5 !important;
    }

    &.greenPrimary.btn-background.white--text:active {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0.2)
        ),
        #05c0a5 !important;
    }

    // btn style: outline, transparent, light - active & hover states
    &.greenPrimary--text.btn-light:hover,
    //&.greenPrimary--text.btn-outline:hover,
    &.greenPrimary--text.btn-transparent:hover {
      background: var(--v-greenLight-base) !important;
    }

    &.greenPrimary--text.btn-light:active,
    &.greenPrimary--text.btn-outline:active,
    &.greenPrimary--text.btn-transparent:active {
      background: var(--v-greenMedium-base) !important;
    }

    /**
    * SECONDARY COLOR THEME 
    */
    // btn style: default background - active & hover states
    &.bluePrimary.btn-background.white--text:hover {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.08),
          rgba(255, 255, 255, 0.08)
        ),
        #4b83e8 !important;
    }

    &.bluePrimary.btn-background.white--text:active {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0.2)
        ),
        #4b83e8 !important;
    }

    // btn style: light, outline, transparent - active & hover states
    &.bluePrimary--text.btn-light:active,
    &.bluePrimary--text.btn-outline:active,
    &.bluePrimary--text.btn-transparent:active {
      background: var(--v-blueMedium-base) !important;
    }

    &.bluePrimary--text.btn-light:hover,
    &.bluePrimary--text.btn-outline:hover,
    &.bluePrimary--text.btn-transparent:hover {
      background: var(--v-blueLight-base) !important;
    }

    /**
    * BASIC COLOR THEME 
    */
    // btn style: default background  - active & hover states
    &.greyPrimary.btn-background.white--text:hover {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.08),
          rgba(255, 255, 255, 0.08)
        ),
        #5a678a !important;
    }

    &.greyPrimary.btn-background.white--text:active {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0.2)
        ),
        #5a678a !important;
    }

    // btn style: outline, light, transparent - active & hover state
    &.greyPrimary--text.btn-light:hover,
    &.greyPrimary--text.btn-transparent:hover {
      background: var(--v-greyLight-base) !important;
    }

    &.greyPrimary--text.btn-outline:hover {
      background: rgba(255, 255, 255, 0.05) !important;
    }

    &.greyPrimary--text.btn-light:active,
    &.greyPrimary--text.btn-outline:active,
    &.greyPrimary--text.btn-transparent:active {
      background: var(--v-greyMedium-base) !important;
    }

    /**
    * ERROR COLOR THEME 
    */
    // btn style: default background - active & hover states
    &.redPrimary.btn-background.white--text:hover {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.08),
          rgba(255, 255, 255, 0.08)
        ),
        #ff445b !important;
    }

    &.redPrimary.btn-background.white--text:active {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0.2)
        ),
        #ff445b !important;
    }

    // btn style: light, outline, transparent - active & hover states
    &.redPrimary--text.btn-light:hover,
    &.redPrimary--text.btn-outline:hover,
    &.redPrimary--text.btn-transparent:hover {
      background: var(--v-redLight-base) !important;
    }

    &.redPrimary--text.btn-light:active,
    &.redPrimary--text.btn-outline:active,
    &.redPrimary--text.btn-transparent:active {
      background: var(--v-redMedium-base) !important;
    }

    /**
    * DISABLED THEME
    */
    // btn style: outline
    &.disabled-outline {
      border: thin solid var(--v-disabledPrimary-base);
      color: var(--v-disabledPrimary-base) !important;
    }
    // btn style: transparent
    &.disabled-transparent {
      color: var(--v-disabledPrimary-base) !important;
    }
    // btn style: light
    &.disabled-light {
      background-color: var(--v-disabledLight-base) !important;
      color: var(--v-disabledPrimary-base) !important;
    }
    // btn style: default bg
    &.disabled-background {
      background-color: var(--v-disabledMedium-base) !important;
      color: var(--v-white-base) !important;
    }
  }
}
</style>
