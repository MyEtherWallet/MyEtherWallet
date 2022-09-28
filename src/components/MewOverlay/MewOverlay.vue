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
            color="white"
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
        <v-row justify="center" class="ma-0 py-8 footer-text">
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

<script>
const sizes = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge'
};

export default {
  name: 'MewOverlay',
  props: {
    /**
     * Displays on the outside bottom of the white sheet.
     * takes an object, i.e {text: 'Need help?', linkTitle: 'Contact support',
     * link: 'mailto:support@myetherwallet.com'}
     */
    footer: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * Opens the overlay from
     * the bottom of the screen.
     */
    showOverlay: {
      type: Boolean,
      default: false
    },
    /**
     * Overlay title.
     * Displays on the white sheet.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Function that gets triggered
     * by close icon on the right.
     *
     */
    close: {
      type: Function,
      default: () => {
        return {};
      }
    },
    /**
     * Function that gets triggered
     * by left arrow icon on the left.
     */
    back: {
      type: Function,
      default: null
    },
    /**
     * Applies the size of the white sheet on the overlay.
     * options: 'small' - 384px, 'medium' - 504px,
     * 'large' - 624px, 'xlarge' - 744px.
     */
    contentSize: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      isOverlayShown: false
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm;
    },
    sheetWidth() {
      if (this.contentSize) {
        switch (this.contentSize.toLowerCase()) {
          case sizes.small:
            return '384px';
          case sizes.medium:
            return '504px';
          case sizes.large:
            return '624px';
          case sizes.xlarge:
            return '744px';
          default:
            return '384px';
        }
      }
      return '384px';
    }
  },
  watch: {
    showOverlay(newVal) {
      this.isOverlayShown = newVal;
    }
  },
  mounted() {
    this.isOverlayShown = this.showOverlay;
  }
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
