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

<script setup>
import { ref } from 'vue';
import MewIcon from './MewIcon.vue';

const props = defineProps({
  leftColsNum: {
    type: Number,
    default: 9
  },
  rightColsNum: {
    type: Number,
    default: 3
  },
  fontClass: {
    type: String,
    default: 'mew-heading-3'
  },
  isColumn: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  },
  titleIcon: {
    type: [String, Array],
    default: ''
  },
  rightIcon: {
    type: [String, Array],
    default: ''
  },
  titleIconType: {
    type: String,
    default: 'mew'
  },
  titleIconClass: {
    type: String,
    default: ''
  },
  rightIconType: {
    type: String,
    default: 'mew'
  },
  note: {
    type: String,
    default: ''
  },
  isNew: {
    type: Boolean,
    default: false
  },
  colorTheme: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const colorThemes = {
  outline: 'outline',
  basic: 'basic',
  primary: 'primary'
};

const iconTypes = {
  mew: 'mew',
  mdi: 'mdi',
  img: 'img'
};

const active = ref(false);

// methods
const showTitleIcon = (icon, type) => {
  return props.titleIconType.toLowerCase() === iconTypes[type];
};

const showRightIcon = (icon, type) => {
  return props.rightIconType.toLowerCase() === iconTypes[type] && hasSrc(icon);
};

const getRowClasses = () => {
  const classes = [];
  if (hasSrc(props.rightIcon)) {
    classes.push('text-center');
  }
  if (props.isColumn) {
    classes.push('column-reverse');
  }
  return classes;
};

const onBtnClick = () => {
  active.value = !active.value;
};

const getColor = () => {
  const colorThemesWhite = ['outline', 'basic'];
  if (colorThemesWhite.indexOf(props.colorTheme) >= 0) {
    return 'white basic-border';
  }

  if (props.colorTheme === colorThemes.primary) {
    return 'superPrimary';
  }
  return props.colorTheme;
};

const getClasses = () => {
  const classes = [];
  if (
    props.colorTheme.toLowerCase() === colorThemes.basic ||
    props.colorTheme.toLowerCase() === colorThemes.primary
  ) {
    classes.push('titlePrimary--text');
  }
  if (props.disabled) {
    classes.push('disabled-btn');
  }
  if (
    active.value &&
    !props.disabled &&
    props.colorTheme.toLowerCase() === colorThemes.basic
  ) {
    classes.push('active');
  }
  return classes;
};

const hasSrc = src => {
  if (src === '' || src.length <= 0) {
    return false;
  }
  return true;
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
