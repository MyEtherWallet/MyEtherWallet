<template>
  <v-btn
    :class="[
      getClasses(),
      'mew-super-button',
      'mew-button',
      isColumn ? 'full-height' : 'full-width mew-super-btn-row'
    ]"
    :color="getColor()"
    :outlined="colorTheme.toLowerCase() === colorThemes.outline"
    :ripple="false"
    :disabled="disabled"
    :text="disabled"
    depressed
    @click="onBtnClick"
  >
    <v-row
      class="pa-3 full-width align-center"
      justify="space-between"
      :class="getRowClasses()"
    >
      <v-col
        :class="[
          'left-container',
          'full-width',
          isColumn ? 'text-center' : 'text-left'
        ]"
        :cols="isColumn ? 12 : leftColsNum"
      >
        <div
          :class="[
            'title-wrapper',
            'd-flex',
            'align-center',
            isColumn ? 'justify-center' : ''
          ]"
        >
          <div :class="[fontClass, 'font-weight-bold', 'truncate']">
            {{ title }}
          </div>
          <div v-if="hasSrc(titleIcon) && !isColumn" class="body-2">
            <img
              v-if="showTitleIcon(titleIcon, 'img')"
              class="icon title-icon"
              :src="titleIcon"
              alt="Icon"
            />
            <mew-icon
              v-if="showTitleIcon(titleIcon, 'mew')"
              :img-height="20"
              class="icon title-icon"
              :icon-name="titleIcon"
            />
            <v-icon
              v-if="showTitleIcon(titleIcon, 'mdi')"
              :class="['icon', 'title-icon', titleIconClass]"
            >
              {{ titleIcon }}
            </v-icon>
          </div>
        </div>
        <div v-if="subtitle" class="mt-2 break-word font-weight-regular">
          {{ subtitle }}
        </div>
        <div v-if="tag" class="body-2 mt-1 tagLabel--text">
          {{ tag }}
        </div>
      </v-col>
      <v-col
        :cols="isColumn ? 12 : rightColsNum"
        :class="[
          'right-container',
          isColumn
            ? 'text-center, pb-0'
            : 'd-flex align-center justify-center text-right'
        ]"
      >
        <slot name="contentSlot" />
        <div
          v-if="isNew"
          class="label-container d-flex align-center text-uppercase"
        >
          <div class="label text-uppercase">new</div>
        </div>
        <div
          v-if="!hasSrc(rightIcon) && note && !isColumn"
          class="note truncate text-uppercase caption warning--text text--darken-1"
        >
          {{ note }}
        </div>
        <img
          v-if="showRightIcon(rightIcon, 'img')"
          class="icon right-icon"
          :src="rightIcon"
          alt="Icon"
        />
        <mew-icon
          v-if="showRightIcon(rightIcon, 'mew')"
          :img-height="100"
          :class="[
            'icon',
            'right-icon',
            !isColumn ? 'd-flex align-center' : ''
          ]"
          :icon-name="rightIcon"
        />
        <v-icon
          v-if="showRightIcon(rightIcon, 'mdi')"
          class="icon right-icon primary--text"
        >
          {{ rightIcon }}
        </v-icon>
      </v-col>
    </v-row>
  </v-btn>
</template>

<script>
import MewIcon from '@/components/MewIcon.vue';
export default {
  name: 'MewSuperButton',
  components: {
    MewIcon
  },
  props: {
    /**
     * The number of cols for the left side to take up.
     */
    leftColsNum: {
      type: Number,
      default: 9
    },
    /**
     * The number of cols for the left side to take up.
     */
    rightColsNum: {
      type: Number,
      default: 3
    },
    /**
     * The font size class that is added to the mew super button title.
     */
    fontClass: {
      type: String,
      default: 'mew-heading-3'
    },
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
      type: [String, Array],
      default: ''
    },
    /**
     * The type of icon: mew, mdi, or img
     */
    titleIconType: {
      type: String,
      default: 'mew'
    },
    /**
     * Adds the color class to the title icon.
     */
    titleIconClass: {
      type: String,
      default: ''
    },
    /**
     * The type of icon: mew, mdi, or img
     */
    rightIconType: {
      type: String,
      default: 'mew'
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
    }
  },
  data() {
    return {
      colorThemes: {
        outline: 'outline',
        basic: 'basic',
        primary: 'primary'
      },
      active: false,
      iconTypes: {
        mew: 'mew',
        mdi: 'mdi',
        img: 'img'
      }
    };
  },
  methods: {
    showTitleIcon(icon, type) {
      return this.titleIconType.toLowerCase() === this.iconTypes[type];
    },
    showRightIcon(icon, type) {
      return (
        this.rightIconType.toLowerCase() === this.iconTypes[type] &&
        this.hasSrc(icon)
      );
    },
    getRowClasses() {
      const classes = [];
      if (this.hasSrc(this.rightIcon)) {
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
        return 'white basic-border';
      }

      if (this.colorTheme === this.colorThemes.primary) {
        return 'superPrimary';
      }
      return this.colorTheme;
    },
    getClasses() {
      const classes = [];
      if (
        this.colorTheme.toLowerCase() === this.colorThemes.basic ||
        this.colorTheme.toLowerCase() === this.colorThemes.primary
      ) {
        classes.push('titlePrimary--text');
      }
      if (this.disabled) {
        classes.push('disabled-btn');
      }
      if (
        this.active &&
        !this.disabled &&
        this.colorTheme.toLowerCase() === this.colorThemes.basic
      ) {
        classes.push('active');
      }
      return classes;
    },
    hasSrc(src) {
      if (src === '' || src.length <= 0) {
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
    flex: auto;
    height: 100%;
    text-transform: none;
    &.mew-super-btn-row {
      .v-btn__content {
        height: 160px;
      }
    }
    &.basic-border {
      border: 1px solid rgb(109, 137, 166, 0.24) !important;
    }
  }
  .disabled-btn {
    color: var(--v-disabled-super-base) !important;
  }
  .white.active {
    // background-color: var(--v-primaryOutlineActive-base) !important;
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
        font-size: 18px;
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
      font-size: 100px;
      max-height: 80px;
    }
  }
}
</style>
