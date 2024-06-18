<template>
  <!-- ===================================================================================== -->
  <!-- Mew Overlay -->
  <!-- ===================================================================================== -->
  <v-bottom-sheet
    :value="isOverlayShown"
    :fullscreen="true"
    persistent
    content-class="mew-overlay"
  >
    <v-sheet
      height="100%"
      color="emerald100"
      class="mew-overlay-container d-flex align-center flex-column"
    >
      <div
        v-if="isMobile"
        class="mobile-title-block pa-3 d-flex align-center justify-space-between full-width"
      >
        <div style="min-width: 36px">
          <v-btn v-if="back" icon color="textBlack2" @click="back">
            <v-icon size="24"> mdi-arrow-left </v-icon>
          </v-btn>
        </div>
        <h3
          class="titlePrimary--text mx-4 text-center"
          style="line-height: 21px"
        >
          {{ title }}
        </h3>
        <div style="min-width: 36px">
          <v-btn v-if="close" icon color="textBlack2" @click="close">
            <v-icon size="24" color="textBlack2"> mdi-close </v-icon>
          </v-btn>
        </div>
      </div>

      <!-- ===================================================================================== -->
      <!-- Mew Overlay action fab buttons (back and close) -->
      <!-- ===================================================================================== -->
      <v-btn
        v-if="back && !isMobile"
        top
        left
        absolute
        text
        rounded
        min-width="48"
        min-height="48"
        color="textBlack2"
        :class="[
          'd-flex action-btn align-center pa-3',
          isMobile ? 'mt-3 ml-n1 mobile-btn' : 'mt-4 ml-1'
        ]"
        fab
        @click="back"
      >
        <v-icon size="24"> mdi-arrow-left </v-icon>
      </v-btn>
      <v-btn
        v-if="close && !isMobile"
        fab
        top
        right
        absolute
        text
        color="textBlack2"
        :class="[
          'd-flex action-btn align-center pa-3',
          ,
          isMobile ? 'mt-3 mr-n1 mobile-btn' : 'mt-4 mr-1'
        ]"
        @click="close"
      >
        <v-icon size="24" color="textBlack2"> mdi-close </v-icon>
      </v-btn>
      <v-container :class="['ma-0 pa-0', isMobile ? 'full-height' : '']" fluid>
        <!-- ===================================================================================== -->
        <!-- White sheet (displays on the overlay - size is based on the contentSize prop) -->
        <!-- ===================================================================================== -->
        <v-row class="ma-0 pa-0 d-flex align-center justify-center flex-column">
          <v-sheet
            :width="isMobile ? '100%' : sheetWidth"
            height="100%"
            color="bgWalletBlock"
            :class="['white-sheet-container', isMobile ? 'mt-0' : 'mt-4']"
          >
            <div
              v-if="!isMobile"
              :class="['text-center pa-8', isMobile && !back ? 'pl-0' : '']"
            >
              <!-- ===================================================================================== -->
              <!-- Title displayed on white sheet -->
              <!-- ===================================================================================== -->
              <div
                :class="[
                  'titlePrimary--text',
                  isMobile
                    ? 'mew-heading-2 ml-3'
                    : isMobile && !back
                    ? 'mew-heading-2 ml-4'
                    : 'mew-subtitle'
                ]"
              >
                {{ title }}
              </div>
            </div>

            <!-- ===================================================================================== -->
            <!-- Slot: used to place custom ui content -->
            <!-- ===================================================================================== -->
            <div
              :class="[
                'd-flex flex-column align-center justify-center',
                isMobile ? 'px-3 pb-6 mobile-content' : 'px-8 pb-8'
              ]"
            >
              <slot />
            </div>
          </v-sheet>
        </v-row>

        <!-- ===================================================================================== -->
        <!-- Footer -->
        <!-- ===================================================================================== -->
        <v-row justify="center" class="ma-0 py-8 textMedium--text">
          {{ footer.text }}
          <a
            v-if="footer && footer.linkTitle && footer.link"
            rel="noopener noreferrer"
            class="cursor-pointer font-weight-medium ml-1"
            :href="footer.link"
            target="_blank"
          >
            {{ footer.linkTitle }}
          </a>
        </v-row>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue';
import { useVuetify } from '@/core/composables/vuetify';

const sizes = {
  small: '384px',
  medium: '504px',
  large: '624px',
  xlarge: '744px'
};

// injections
const vuetify = useVuetify();

// props
const props = defineProps({
  footer: {
    type: Object,
    default: () => {
      return {};
    }
  },
  showOverlay: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  close: {
    type: Function,
    default: () => {
      return {};
    }
  },
  back: {
    type: Function,
    default: null
  },
  contentSize: {
    type: String,
    default: 'small'
  }
});

// data
const isOverlayShown = ref(false);

// computed
const isMobile = computed(() => {
  return vuetify.breakpoint.xs || vuetify.breakpoint.sm;
});

const sheetWidth = computed(() => {
  return props.contentSize
    ? sizes[props.contentSize.toLowerCase()]
    : sizes.small;
});

// watch
watch(
  () => props.showOverlay,
  newVal => {
    if (newVal) {
      removeHtmlScrollbar();
    } else {
      restoreHtmlScrollbar();
    }
    isOverlayShown.value = newVal;
  }
);

// destroyed
onUnmounted(() => {
  restoreHtmlScrollbar();
});

// methods
onMounted(() => {
  isOverlayShown.value = props.showOverlay;
});

// methods
const removeHtmlScrollbar = () => {
  const htmlElement = document.querySelector('html');
  htmlElement.style.overflow = 'hidden';
};

const restoreHtmlScrollbar = () => {
  const htmlElement = document.querySelector('html');
  htmlElement.style.overflow = null;
};
</script>

<style lang="scss" scoped>
.mew-overlay-container::before,
.mew-overlay-container::after {
  content: '';
  margin: auto;
}

.mew-overlay-container {
  overflow: auto;
  .white-sheet-container {
    border-radius: 12px;
    box-shadow: 0px 12px 17px rgba(21, 29, 63, 0.0332441);
  }
  .action-btn {
    height: auto;
    top: 0 !important;
    width: auto;
    .v-btn:hover {
      background-color: rgba(95, 99, 104, 0.06);
    }
  }
  .footer-text {
    color: rgba(11, 40, 64, 0.72);
  }
  .mobile-title {
    box-shadow: 0px 1px 6px rgba(11, 40, 64, 0.06),
      0px 2px 8px rgba(11, 40, 64, 0.04);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9999;
  }

  .mobile-btn {
    z-index: 99999;
  }
}

.mew-overlay {
  .mobile-title-block {
    background-color: var(--v-greyLight-base);
    border-bottom: 1px solid var(--v-greyLight-base);
  }
}
</style>
