<template>
  <!--
  =====================================================================================
    Mew Icon Button
  =====================================================================================
  -->
  <v-btn
    :target="btnLink ? '_blank' : ''"
    :href="btnLink"
    :class="[buttonClasses, 'mew-icon-button']"
    :color="buttonColor"
    :disabled="disabled"
    depressed
    :outlined="hasOutline"
    :text="isTransparent"
    :width="size"
    :height="size"
    :min-width="size"
    :min-height="size"
    :dark="!disabled"
    :fab="rounded"
  >
    <v-icon
      v-if="mdiIcon && !loading"
      color="buttonGrayDark"
      :x-small="mdiIconSize === mdiIconSizes.xsmall"
      :small="mdiIconSize === mdiIconSizes.small"
      :dense="mdiIconSize === mdiIconSizes.dense"
      :large="mdiIconSize === mdiIconSizes.large"
      :x-large="mdiIconSize === mdiIconSizes.xlarge"
    >
      mdi-{{ mdiIcon }}
    </v-icon>

    <!-- TODO: decide if we still want to allow this option -->
    <!-- <img
      v-if="imgIcon && !loading"
      :src="require(`@/assets/images${imgIcon}`)"
      alt="Icon"
      :width="imgIconSize"
      :height="imgIconSize"
    > -->

    <!--
    =====================================================================================
      Loading state
    =====================================================================================
    -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      size="15"
      :color="loadingColor"
    />

    <!--
    =====================================================================================
      Loaded Button Content 
    =====================================================================================
    -->
    <div v-if="!loading" class="d-flex justify-center align-center">
      <!--
      =====================================================================================
      Button text (if no title prop is passed, then slot should be used)
      TODO: decide if we still want this option.
      =====================================================================================
      -->
      <!-- <span
        v-if="title"
        class="font-weight-regular"
      >{{ title }} </span> -->

      <!--
      =====================================================================================
        slot: default
      =====================================================================================
      -->
      <slot />
    </div>
  </v-btn>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  /**
   * Enables loading state.
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * Rounds button corners.
   */
  rounded: {
    type: Boolean,
    default: false
  },
  /**
   * Button sizes: small, medium.
   */
  btnSize: {
    type: String,
    default: 'medium'
  },
  /**
   * Mdi icon size: xsmall, small, medium, large, xlarge.
   */
  mdiIconSize: {
    type: String,
    default: ''
  },
  /**
   * TODO: decide if we still want to allow this option.
   * Image icon size: small, medium.
   */
  // imgIconSize: {
  //   type: String,
  //   default: '20',
  // },
  /**
   * TODO: decide if we still want to allow this option.
   * Sets the button to have 100% width.
   */
  // hasFullWidth: {
  //   type: Boolean,
  //   default: true,
  // },
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
   * TODO: decide if we still want to allow this option.
   * The text that will display at the center of the button.
   * If not passed, a slot should be used.
   */
  // title: {
  //   type: String,
  //   default: '',
  // },
  /**
   * Applies the button color theme: primary, secondary, basic, error.
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
  },
  /**
   * mdi icon name.
   */
  mdiIcon: {
    type: String,
    default: ''
  }
  /**
   * TODO: decide if we still want to allow this option.
   * img icon path. (base dir: @/assets/images)
   * use) img-icon="/icons/icon-chrome.svg"
   */
  // imgIcon: {
  //   type: String,
  //   default: '',
  // },
});

// data
/**
 * all color theme options
 */
const colorThemes = {
  secondary: 'secondary',
  primary: 'primary',
  basic: 'basic',
  error: 'error'
};
/**
 * all btn style options
 */
const btnStyles = {
  light: 'light',
  transparent: 'transparent',
  outline: 'outline',
  background: 'background'
};
/**
 * all btn size options
 */
const btnSizes = {
  small: 'small',
  medium: 'medium'
};
/**
 * all mdi icon size options
 */
const mdiIconSizes = {
  xsmall: 'x-small',
  small: 'small',
  dense: 'dense',
  large: 'large',
  xlarge: 'x-large'
};

// computed
const size = computed(() => {
  if (props.btnSize === btnSizes.small) return '32px';
  return '40px';
});

/**
 * @returns if color theme is primary.
 */
const isPrimaryTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.primary;
});

/**
 * @returns if color theme is secondary.
 */
const isSecondaryTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.secondary;
});

/**
 * @returns if color theme is basic.
 */
const isBasicTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.basic;
});

/**
 * @returns if color theme is error.
 */
const isErrorTheme = computed(() => {
  return props.colorTheme.toLowerCase() === colorThemes.error;
});

/**
 * @returns the process circular loading color.
 */
const loadingColor = computed(() => {
  if (!props.disabled && isLight.value && isPrimaryTheme.value) {
    return 'greenPrimary';
  }

  if (!props.disabled && isLight.value && isSecondaryTheme.value) {
    return 'bluePrimary';
  }

  if (!props.disabled && isLight.value && isErrorTheme.value) {
    return 'redPrimary';
  }

  if (!props.disabled && isLight.value && isBasicTheme.value) {
    return 'greyPrimary';
  }

  if (!props.disabled && !isBackground.value) {
    return props.buttonColor;
  }

  if (props.disabled && !isBackground.value) {
    return 'disabledPrimary';
  }

  return 'white';
});

/**
 * @returns button color based on color theme and btn style props.
 */
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
    return 'backgroundOverlay';
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

/**
 * @returns button classes based on given props
 */

const buttonClasses = computed(() => {
  const classes = [];
  // adds btn size
  if (props.btnSize.toLowerCase()) {
    classes.push(props.btnSize.toLowerCase() + '-btn');
  }

  // adds 100% full width
  // if (props.hasFullWidth === true) {
  //   classes.push('full-width');
  // }

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

/**
 * @returns if btn style is transparent.
 */
const isTransparent = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.transparent;
});

/**
 * @returns if btn style has an outline/border.
 */
const hasOutline = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.outline;
});

/**
 * @returns if btn style is a lighter color.
 */
const isLight = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.light;
});

/**
 * @returns if btn style is the default background color.
 */
const isBackground = computed(() => {
  return props.btnStyle.toLowerCase() === btnStyles.background;
});
</script>

<style lang="scss" scoped>
// MEW BUTTON STYLES
.v-application {
  .v-btn:not(.v-btn--round) {
    padding: 0;
    border-radius: 8px;
  }

  .v-btn.mew-icon-button {
    // BUTTON SIZES
    &.small-btn {
      padding: 8px;
    }

    &.medium-btn {
      padding: 0 20px;
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
    &.greenPrimary--text.btn-outline:hover,
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
    &.greyPrimary--text.btn-outline:hover,
    &.greyPrimary--text.btn-transparent:hover {
      background: var(--v-greyLight-base) !important;
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
