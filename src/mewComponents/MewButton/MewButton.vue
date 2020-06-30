<template>
  <v-btn
    :target="btnLink ? '_blank' : ''"
    :href="btnLink"
    :class="[getClasses(), 'mew-button']"
    :color="colorTheme"
    :disabled="disabled"
    depressed
    :outlined="btnStyle.toLowerCase() === btnStyles.outline"
    :text="btnStyle.toLowerCase() === btnStyles.transparent"
    @click="onBtnClick()"
  >
    <img v-if="leftIcon" class="icon mr-1" :src="leftIcon" alt="icon" />
    <v-icon v-if="leftMdIcon" class="mr-2">{{ leftMdIcon }}</v-icon>
    <span>{{ title }}</span>
    <img
      v-if="rightIcon && icon"
      class="icon ml-1"
      :src="rightIcon"
      alt="icon"
    />
    <v-icon v-if="rightMdIcon" class="ml-2">{{ rightMdIcon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'MewButton',
  props: {
    /**
     * Button size: small, medium, large, xlarge.
     */
    buttonSize: {
      type: String,
      default: 'large'
    },
    /**
     * Sets the button to have 100% width.
     */
    hasFullWidth: {
      type: Boolean,
      default: true
    },
    /**
     * The text that will go in the button.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * The icon url. Inserts an icon next to the button title.
     */
    leftIcon: {
      type: [String, Array],
      default: ''
    },
    rightIcon: {
      type: [String, Array],
      default: ''
    },
    /**
     * The Material Design icon. Inserts an icon next to the button title.
     */
    leftMdIcon: {
      type: String,
      default: ''
    },
    rightMdIcon: {
      type: String,
      default: ''
    },
    /**
     * Applies the button color theme: basic, primary, error, white, or secondary.
     */
    colorTheme: {
      type: String,
      default: 'primary'
    },
    /**
     * Applies the button style: background, transparent, or outline.
     */
    btnStyle: {
      type: String,
      default: 'background'
    },
    /**
     * Removes the ability to click or target the component.
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * Opens up a new page with the link.
     */
    btnLink: {
      type: String,
      default: ''
    },
    /**
     * Displays the buttons' active state.
     */
    showsActiveState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnStyles: {
        background: 'background',
        transparent: 'transparent',
        outline: 'outline'
      },
      colorThemes: {
        white: 'white',
        primary: 'primary'
      },
      iconAlignments: {
        left: 'left',
        right: 'right'
      },
      btnSizes: {
        small: 'small',
        medium: 'medium',
        large: 'large',
        xlarge: 'xlarge'
      },
      active: false
    };
  },
  methods: {
    onBtnClick() {
      this.active = !this.active;
    },
    getClasses() {
      const classes = [];

      if (this.buttonSize.toLowerCase() === this.btnSizes.small) {
        classes.push('small-btn', 'mew-caption');
      }

      if (this.buttonSize.toLowerCase() === this.btnSizes.medium) {
        classes.push('medium-btn');
      }

      if (this.buttonSize.toLowerCase() === this.btnSizes.large) {
        classes.push('large-btn');
      }

      if (this.buttonSize.toLowerCase() === this.btnSizes.xlarge) {
        classes.push('xlarge-btn');
      }

      if (this.hasFullWidth === true) {
        classes.push('full-width');
      }

      if (
        this.btnStyle.toLowerCase() === this.btnStyles.background &&
        this.colorTheme.toLowerCase() !== this.colorThemes.white
      ) {
        classes.push('white--text');
      }

      if (
        this.btnStyle.toLowerCase() === this.btnStyles.background &&
        this.colorTheme.toLowerCase() === this.colorThemes.white
      ) {
        classes.push('primary--text');
      }

      if (this.active && !this.disabled && this.showsActiveState) {
        classes.push('active');
      }

      if (
        this.active &&
        this.showsActiveState &&
        !this.disabled &&
        this.btnStyle.toLowerCase() === this.btnStyles.outline
      ) {
        classes.push('bg-white');
      }

      return classes;
    },
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
.v-application {
  .v-btn {
    border-radius: 6px !important;

    .icon {
      height: 45px;
    }

    // button sizes
    &.small-btn {
      min-height: 24px;
      padding: 0 15px;
    }

    &.medium-btn {
      min-height: 34px;
      padding: 0 20px;
    }

    &.large-btn {
      min-height: 46px;
      padding: 0 20px;
      .icon {
        height: 30px;
      }
    }

    &.xlarge-btn {
      min-height: 62px;
      padding: 0 35px;
    }

    // button active states
    &.primary.white--text.active {
      background-color: var(--v-primaryActive-base) !important;
    }

    &.primary.white--text:hover {
      background-color: var(--v-primaryHover-base) !important;
    }

    &.primary--text.v-btn--outlined.active {
      background-color: var(--v-primaryOutlineActive-base) !important;
    }

    &.secondary--text.v-btn--outlined.active {
      background-color: var(--v-secondaryOutlineActive-base) !important;
    }

    &.error--text.v-btn--outlined.active {
      background-color: var(--v-errorOutlineActive-base) !important;
    }

    &.basic--text.v-btn--outlined.active {
      background-color: var(--v-basicOutlineActive-base) !important;
    }

    // disabled btn
    &.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
      background-color: var(--v-disabled-base) !important;
      color: var(--v-white-base) !important;
    }
  }
}
</style>
