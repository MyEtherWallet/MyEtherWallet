<template>
  <v-btn
    @click="onBtnClick()"
    :class="[ getClasses() , 'mew-super-button','mew-button', isColumn ? '' : 'full-width']"
    :color="getColor()"
    :outlined="colorTheme.toLowerCase() === colorThemes.outline"
    :ripple="false"
    :disabled="disabled"
    :text="disabled" 
    depressed
  >
    <v-row
      class="pa-3 full-width"
      justify="space-between"
      :class="getRowClasses()"
    >
      <v-col
        :class="['left-container', 'full-width', isColumn ? 'text-center' : 'text-left']"
        :cols="isColumn ? 12 : 9"
      >
        <div :class="['title-wrapper', 'd-flex', 'align-center', isColumn ? 'justify-center' : '' ]">
          <div class="mew-heading-3 font-weight-bold truncate">
            {{ title }}
          </div>
          <div
            class="body-2"
            v-if="showIcon(titleIcon) && !isColumn"
          >
            <img
              v-if="showIcon(titleIcon)"
              class="icon title-icon"
              :src="titleIcon"
              alt="Icon"
            >
          </div>
        </div>
        <div
          class="mt-2 break-word"
          v-if="subtitle"
        >
          {{ subtitle }}
        </div>
        <div class="body-2 mt-1 tagLabel--text">
          {{ tag }}
        </div>
      </v-col>
      <v-col
        :cols="isColumn ? 12 : 3"
        :class="['right-container', isColumn ? 'text-center, pb-0' : 'd-flex align-center justify-center text-right']"
      >
        <slot name="rightSlot" />
        <div
          v-if="isNew"
          class="label-container d-flex align-center text-uppercase"
        >
          <div class="label">
            {{ newLabel }}
          </div>
        </div>
        <div
          v-if="!showIcon(rightIcon) && note && !isColumn"
          class="note truncate text-uppercase caption warning--text text--darken-1"
        >
          {{ note }}
        </div>
        <img
          v-if="showIcon(rightIcon)"
          class="icon right-icon"
          :src="rightIcon"
          alt="Icon"
        >
      </v-col>
    </v-row>
  </v-btn>
</template>

<script>
export default {
  name: 'MewSuperButton',
  props: {
    /**
     * The button content will be set as a column rather than row.
     */
    isColumn: {
      type: Boolean,
      default: false
    },
    /**
     * The text that will go in the button.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * The text that will go under the button title.
     */
    subtitle: {
      type: String,
      default: ''
    },
    /**
     * The text that will go under the button subtitle.
     */
    tag: {
      type: String,
      default: ''
    },
    /**
     * The title-icon url. Inserts an icon next to the button title.
     */
    titleIcon: {
      type: [String, Array],
      default: ''
    },
    /**
     * The right-icon url. Inserts an icon on the right container of the button.
     */
    rightIcon: {
      type:[String, Array],
      default: ''
    },
    /**
     * The text that will go on the upper right corner. Will not display if right-icon is true.
     */
    note: {
      type: String,
      default: ''
    },
    /**
     * Applies a new badge to the button.
     */
    isNew: {
      type: Boolean,
      default: false
    },
    /**
     * Applies the button color theme: basic, primary, or outline.
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
     * Label for new badge.
     */
    newLabel: {
      type: String,
      default: 'new'
    }
  },
  data() {
    return {
      colorThemes: {
        outline: 'outline',
        basic: 'basic',
        primary: 'primary'
      },
      active: false
    };
  },
  methods: {
    getRowClasses() {
      const classes = [];
      if (this.showIcon(this.rightIcon)) {
        classes.push('text-center');
      }

      if (this.isColumn) {
        classes.push('column-reverse');
      }

      return classes;
    }, 
    onBtnClick() {
      this.active = !this.active;
    },
    getColor() {
      const colorThemesWhite = ['outline', 'basic'];
      if (colorThemesWhite.indexOf(this.colorTheme) >= 0) {
        return 'white';
      }
      
      if (this.colorTheme === this.colorThemes.primary) {
        return 'superPrimary'
      }

      return this.colorTheme;
    },
    getClasses() {
      const classes = [];
      if (this.colorTheme.toLowerCase() === this.colorThemes.basic || this.colorTheme.toLowerCase() === this.colorThemes.primary) {
        classes.push('titlePrimary--text');
      }

      if (this.disabled) {
        classes.push('disabled-btn');
      }

      if (this.active && !this.disabled) {
        classes.push('active');
      }

      return classes;
    },
    showIcon(src) {
      if (src === '' || src.length <= 0 ) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss">
.v-application {
  .v-btn.mew-super-button {
    border-radius: 12px;
    height: 100%;
    text-transform: none;

    .v-btn__content {
      height: 160px;
    }
  }

  .disabled-btn {
    color: var(--v-disabled-super-base) !important;
  }

  .basic--text.active {
    background-color: var(--v-primaryOutlineActive-base) !important;
    border: 2px solid var(--v-primary-base) !important;
  }

  .v-btn.basic--text {
    &:hover {
      background-color: var(--v-superPrimaryHover-base) !important;
    }
  }

  .left-container {
    .title-wrapper {
      .title-icon {
        max-height: 20px;
        margin-left: 2px;
      }
    }
  }

  .right-container {
    .note {
      position: absolute;
      top: 13px;
      right: 0;
    }
    .label-container {
      border-right: 25px solid red;
      border-top: 25px solid red;
      border-left: 25px solid transparent;
      border-bottom: 25px solid transparent;
      border-radius: 0 12px 0 0;
      height: 46px;
      position: absolute;
      right: -16px;
      top: 0;
      width: 0;
      .label {
        color: #fff;
        font-size: 12px;
        margin-top: -15px;
        margin-left: -8px;
        transform: rotate(45deg);
      }
    }

    .right-icon {
      max-height: 80px;
    }
  }
}
</style>
