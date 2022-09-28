<template>
  <!--
      =====================================================================================
        Mew Popup
        =====================================================================================
      -->
  <v-dialog
    :max-width="maxWidth"
    :value="show"
    :fullscreen="scrollable ? $vuetify.breakpoint.xs : false"
    content-class="ma-0"
    :scrollable="scrollable"
    @click:outside="handleClickOutside"
  >
    <v-card
      color="white"
      class="pa-0"
    >
      <!--
      =====================================================================================
        Dialog Header
        =====================================================================================
      -->
      <div :class="title ? 'pt-0' : 'pt-5'">
        <v-btn
          v-if="!hideCloseBtn"
          icon
          class="header-close-icon"
        >
          <v-icon
            size="x-large"
            color="grey cursor--pointer"
            @click="leftBtn.method"
          >
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <v-card-title
        v-if="title"
        :class="[
          'justify-center px-5 px-md-7',
          hasBodyContent ? 'py-5 py-md-8' : 'pb-0 pt-5 pt-md-8'
        ]"
      >
        <div class="mew-heading-2 break-word text-center">
          {{ title }}
        </div>
      </v-card-title>
      <!--
      =====================================================================================
        Dialog Body
        default slot: to set customized body content
      =====================================================================================
      -->
      <v-card-text
        v-if="hasBodyContent"
        :class="[hasPadding ? 'py-3 px-5 px-md-7' : 'pa-0']"
      >
        <slot />
      </v-card-text>
      <!--
      =====================================================================================
        Dialog action
      =====================================================================================
      -->
      <v-card-actions
        v-if="hasButtons"
        class="py-5 py-md-8"
      >
        <v-row
          class="pa-0"
          justify="space-around"
          dense
        >
          <v-col
            cols="12"
            :sm="!rightBtn ? '12' : '6'"
            :class="!rightBtn ? 'text-left' : 'text-right'"
            :order="!rightBtn ? '1' : '2'"
            order-sm="1"
          >
            <mew-button
              btn-style="outline"
              btn-size="xlarge"
              :color-theme="leftBtn.color || 'primary'"
              :title="leftBtn.text"
              :has-full-width="!rightBtn ? true : $vuetify.breakpoint.xs"
              @click.native="leftBtn.method"
            />
          </v-col>
          <v-col
            v-if="rightBtn"
            cols="12"
            sm="6"
            class="text-left"
            order="1"
            order-sm="2"
          >
            <mew-button
              btn-size="xlarge"
              :color-theme="rightBtn.color || 'primary'"
              :title="rightBtn.text"
              :disabled="!rightBtn.enabled"
              :has-full-width="$vuetify.breakpoint.xs"
              @click.native="rightBtn.method"
            />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MewButton from '@/components/MewButton/MewButton.vue';

export default {
  components: { MewButton },
  props: {
    /**
     * Title of popup.
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Hide top right close button
     */
    hideCloseBtn: {
      type: Boolean,
      default: false
    },
    /**
     * Controls popup visibility.
     */
    show: {
      type: Boolean,
      default: false
    },
    /**
     * Left Button: object of information.
     * Includes text, color and method attributes.
     * left button is always enabled.
     */
    leftBtn: {
      type: Object,
      default: () => {
        return { text: 'Cancel', color: 'primary', method: () => {} };
      }
    },
    /**
     * Right Button: object of information.
     * Includes text, color, enabled and method attributes.
     */
    rightBtn: {
      type: Object,
      default: () => {
        return {
          text: 'Confirm',
          color: 'primary',
          enabled: true,
          method: () => {}
        };
      }
    },
    /**
     * Makes the popup content scrollable.
     */
    scrollable: {
      type: Boolean,
      default: false
    },
    /**
     * Max width of the popup.
     */
    maxWidth: {
      type: String,
      default: '600'
    },
    /**
     * Displays v-card-text if there is popup body content
     * otherwise it removes it and adjusts the padding accordingly
     */
    hasBodyContent: {
      type: Boolean,
      default: false
    },
    /**
     * Will display popup body content padding if true
     */
    hasPadding: {
      type: Boolean,
      default: true
    },
    /**
     * Will display popup body content padding if true
     */
    hasButtons: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * Will call left btn method which is cancel method.
     */
    handleClickOutside() {
      this.leftBtn.method();
    }
  }
};
</script>

<style lang="scss" scoped>
.header-close-icon {
  right: 10px;
  top: 10px;
  position: absolute;
  z-index: 9;
}
</style>
