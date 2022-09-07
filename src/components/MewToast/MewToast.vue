<template>
  <!--
=====================================================================================
  Mew Toast 
=====================================================================================
-->
  <v-bottom-sheet
    ref="toast"
    v-model="showsToast"
    :hide-overlay="true"
    :retain-focus="false"
    :persistent="persistent"
  >
    <v-sheet
      class="text-center"
      :tile="true"
      height="80"
      :color="toastType.toLowerCase() === toastTypes.info ? 'white' : toastType"
    >
      <v-container fill-height>
        <v-row
          :class="['font-weight-medium', getRowClasses()]"
          justify="center"
          align="center"
        >
          <div class="d-flex align-center">
            <v-icon
              v-if="toastTypes.info !== toastType.toLowerCase()"
              :color="
                toastTypes.warning === toastType.toLowerCase()
                  ? 'warning darken-1'
                  : 'white'
              "
            >
              {{ getIcon() }}
            </v-icon>
            {{ text }}
            <a :class="getLinkClasses()" @click="onClick"
              >{{ linkObj.title }}
            </a>
            <!--
=====================================================================================
  Slot: infoBtn (used to place custom ui in the toast body)
=====================================================================================
-->
            <slot name="infoBtn" />
          </div>
          <v-icon
            v-if="canClose"
            color="titlePrimary"
            class="close cursor-pointer"
            @click="close"
          >
            mdi-close
          </v-icon>
        </v-row>
      </v-container>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: 'MewToast',
  props: {
    /**
     * Toast types: success, warning, error.
     */
    toastType: {
      type: String,
      default: ''
    },
    /**
     * The duration of the toast. 0 is indefinite.
     */
    duration: {
      type: Number,
      default: 0
    },
    /**
     * The toast text.
     */
    text: {
      type: String,
      default: ''
    },
    /**
     * Applies the link url to the end of the text. Takes title and url, i.e. {title: '', url: ''}
     */
    linkObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * Clicking outside of the element will not deactivate it.
     */
    persistent: {
      type: Boolean,
      default: false
    },
    /**
     * Clicking outside of the element will deactivate it.
     */
    canClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showsToast: false,
      toastTypes: {
        warning: 'warning',
        error: 'error',
        success: 'success',
        info: 'info'
      }
    };
  },
  watch: {
    showsToast(newVal) {
      this.$nextTick(() => {
        this.$refs.toast.showScroll();
      });

      if (!newVal) {
        this.$emit('closed');
      }
    }
  },
  mounted() {
    this.setTimer();
  },
  methods: {
    close() {
      this.showsToast = false;
    },
    onClick() {
      this.linkObj.url !== '' && this.linkObj.url
        ? this.$emit('onClick')
        : this.$emit('onClick');
    },
    getLinkClasses() {
      if (
        this.toastTypes.warning === this.toastType.toLowerCase() ||
        this.toastTypes.info === this.toastType.toLowerCase()
      ) {
        return 'primary--text';
      }
      return 'white--text';
    },
    getRowClasses() {
      if (
        this.toastTypes.warning === this.toastType.toLowerCase() ||
        this.toastTypes.info === this.toastType.toLowerCase()
      ) {
        return 'titlePrimary--text';
      }
      return 'white--text';
    },
    getIcon() {
      const toastType = this.toastType.toLowerCase();
      if (toastType === this.toastTypes.warning) {
        return 'mdi-alert';
      } else if (toastType === this.toastTypes.success) {
        return 'mdi-check-circle';
      } else if (toastType === this.toastTypes.error) {
        return 'mdi-close-circle';
      }
    },
    setTimer() {
      if (this.duration > 0 && this.showsToast === true && !this.persistent) {
        setTimeout(() => (this.showsToast = false), this.duration);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.close {
  font-size: 20px;
  position: absolute;
  right: 20px;
}
</style>
