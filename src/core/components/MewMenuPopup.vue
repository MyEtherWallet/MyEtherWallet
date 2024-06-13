<template>
  <div class="mew-menu-popup">
    <div
      id="unique-id--mew-menu-popup--activator"
      ref="activator"
      class="mew-menu-popup-activator"
      @click.stop="toggleMenu"
    >
      <!-- ================================================================== -->
      <!-- Activator button by prop -->
      <!-- ================================================================== -->
      <v-btn
        v-if="btnTitle"
        class="px-3"
        :icon="icon"
        :color="color"
        :outlined="outlined"
        :x-small="btnSize == 'x-small'"
        :small="btnSize == 'small'"
        :large="btnSize == 'large'"
        :x-large="btnSize == 'x-large'"
      >
        <img
          v-if="btnIcon"
          :style="`height: ${btnIconSize}; width: ${btnIconSize}`"
          :src="btnIcon"
          alt="Icon"
          :class="btnTitle ? 'mr-2' : ''"
        />
        <span :style="btnTitleStyle">{{ btnTitle }}</span>
      </v-btn>

      <!-- ================================================================== -->
      <!-- Activator slot -->
      <!-- ================================================================== -->
      <slot name="activator" />

      <!-- ================================================================== -->
      <!-- Top arrow for content window -->
      <!-- ================================================================== -->
      <div
        class="top-arrow content-fade-base"
        :class="show ? '' : 'content-fade-out'"
      />
    </div>

    <!-- ================================================================== -->
    <!-- Content slot -->
    <!-- ================================================================== -->
    <div style="position: relative">
      <div
        ref="content"
        class="mew-menu-popup-content content-fade-base"
        :class="show ? '' : 'content-fade-out'"
        :style="contentWindowStyle"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue';

// emits
const emits = defineEmits(['input']);

// props
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'white'
  },
  btnTitle: {
    type: String,
    default: ''
  },
  btnSize: {
    type: String,
    default: 'large'
  },
  btnFontSize: {
    type: String,
    default: '14px'
  },
  btnIcon: {
    type: String,
    default: ''
  },
  btnIconSize: {
    type: String,
    default: '30px'
  },
  left: {
    type: Boolean,
    default: false
  },
  right: {
    type: Boolean,
    default: false
  }
});

// data
const show = ref(props.value);
const activator = ref(null);
const content = ref(null);

// computed
const activatorEl = computed(() => {
  //return document.querySelector('#unique-id--mew-menu-popup--activator');
  return activator.value;
});

const contentEl = computed(() => {
  //return document.querySelector('#unique-id--mew-menu-popup--content');
  return content.value;
});

const btnTitleStyle = computed(() => {
  return `
    font-size: ${props.btnFontSize};
  `;
});

const contentWindowStyle = computed(() => {
  // Align content to left edge
  if (props.left) {
    return `
      left: 0;
    `;
  }

  // Align content to right edge
  if (props.right) {
    return `
      right: 0;
    `;
  }

  // Align content to center
  return `
      left: 50%;
      transform: translate(-50%, 0);
  `;
});

// watch
watch(
  () => props.value,
  val => {
    show.value = val;
  }
);

// methods
const toggleMenu = () => {
  show.value = !show.value;
  if (show.value) {
    window.addEventListener('click', detactOutsideClick);
  } else {
    window.removeEventListener('click', detactOutsideClick);
  }

  emits('input', show.value);
};

const detactOutsideClick = e => {
  const targetEl = e.target;
  if (
    !(
      targetEl == contentEl.value ||
      targetEl == activatorEl.value ||
      (contentEl.value && contentEl.value.contains(targetEl)) ||
      (activatorEl.value && activatorEl.value.contains(targetEl))
    )
  ) {
    show.value = false;
    window.removeEventListener('click', detactOutsideClick);
  }
};
</script>

<style lang="scss" scoped>
// ======================================================================
// main container
// ======================================================================
.mew-menu-popup {
  position: relative;
  display: inline-block;

  .v-btn {
    border-radius: 8px;
    text-transform: none;
  }
}

// ======================================================================
// activator container
// ======================================================================
.mew-menu-popup-activator {
  display: inline-block;
  cursor: pointer;
  user-select: none;
  position: relative;
}

// ======================================================================
// top arrow
// ======================================================================
.top-arrow {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid white;
  position: absolute;
  z-index: 1000;
  bottom: -16px;
  right: 0;
  left: 50%;
  transform: translate(-50%, 0);
  pointer-events: none;
}

// ======================================================================
// content container
// ======================================================================
.mew-menu-popup-content {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 5px 5px -3px rgb(13 41 66 / 20%),
    0 8px 10px 1px rgb(13 41 66 / 14%), 0 3px 14px 2px rgb(13 41 66 / 12%);
  max-height: 400px;
  overflow-x: hidden;
  position: absolute;
  top: 16px;
  z-index: 999;
}

// ======================================================================
// content block fade in/out animation
// ======================================================================
.content-fade-base {
  opacity: 1;
  transition: opacity 0.2s ease;
}
.content-fade-out {
  opacity: 0;
  pointer-events: none;
}
</style>
