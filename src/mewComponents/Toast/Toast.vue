<template>
  <div>
    <v-bottom-sheet
      v-model="showsToast" 
      :hide-overlay="true"
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
            <div>
              <v-icon
                v-if="toastTypes.info !== toastType.toLowerCase()"
                :color="toastTypes.warning === toastType.toLowerCase() ? 'warning darken-1' : 'white'"
              >
                {{ getIcon() }}
              </v-icon>
              {{ text }}
              <a
                :class="getLinkClasses()"
                :href="linkObj.url"
              >{{ linkObj.title }}
              </a>
              <slot name="infoBtn" />
            </div>
            <v-icon
              color="titlePrimary"
              v-if="canClose"
              class="close"
            >
              mdi-close
            </v-icon>
          </v-row>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      showsToast: false,
      toastTypes: {
        warning: 'warning',
        error: 'error',
        success: 'success',
        info: 'info'
      }
    }
  },
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
      default: function() {
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
     * Clicking outside of the element will not deactivate it.
     */
    canClose: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.setTimer();
  },
  methods: {
    showToast() {
      this.showsToast = true;
      this.setTimer();
    },  
    getLinkClasses() {
      if (this.toastTypes.warning === this.toastType.toLowerCase() || this.toastTypes.info === this.toastType.toLowerCase()) {
        return 'primary--text';
      }
      return 'white--text';
    },
    getRowClasses() {
      if (this.toastTypes.warning === this.toastType.toLowerCase() || this.toastTypes.info === this.toastType.toLowerCase()) {
        return 'titlePrimary--text';
      } 
      return 'white--text';
    },
    getIcon() {
      const toastType = this.toastType.toLowerCase();
      if (toastType === this.toastTypes.warning ) {
        return 'mdi-alert';
      } else if (toastType === this.toastTypes.success ) {
        return 'mdi-check-circle';
      } else if (toastType === this.toastTypes.error) {
        return 'mdi-close-circle'
      }
    },
    setTimer() {
      if(this.duration > 0 && this.showsToast === true && !this.persistent) {
        setTimeout(() => this.showsToast = false, this.duration);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.close {
  font-size: 20px;
  position: absolute;
  right: 20px;
}
</style>