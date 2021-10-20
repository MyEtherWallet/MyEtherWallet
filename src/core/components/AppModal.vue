<template>
  <v-dialog
    :max-width="width"
    :value="show"
    :fullscreen="scrollable ? $vuetify.breakpoint.xs : false"
    content-class="core--components--app-modal"
    :scrollable="scrollable"
    :persistent="isPersistent"
    @click:outside="handleClickOutside"
  >
    <v-card v-if="scrollable" color="white" class="py-0 px-5 px-md-7">
      <!--
      =====================================================================================
        Dialog Header
        =====================================================================================
      -->
      <v-card-title class="justify-center py-5 py-md-8">
        <div class="mew-heading-2 text-center">
          {{ title }}
        </div>
        <v-btn icon class="header-close-icon">
          <v-icon size="x-large" color="grey cursor--pointer" @click="close">
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <!--
      =====================================================================================
        Dialog Body: Scrollable
      =====================================================================================
      -->
      <v-card-text v-if="!anchored" class="py-3 px-5 px-md-0">
        <slot name="dialogBody">
          <div>This is a test value</div>
        </slot>
      </v-card-text>
      <!--
      =====================================================================================
        Dialog Body: Anchored
      =====================================================================================
      -->
      <slot v-else name="dialogBody" />
      <!--
      =====================================================================================
        Dialog action
      =====================================================================================
      -->
      <v-card-actions class="py-5 py-md-8">
        <v-row v-if="hasButtons" class="pa-0" justify="space-around" dense>
          <v-col
            v-if="!closeOnly"
            cols="12"
            sm="5"
            class="text-right"
            order="2"
            order-sm="1"
          >
            <mew-button
              btn-style="outline"
              btn-size="xlarge"
              title="Cancel"
              :has-full-width="$vuetify.breakpoint.xs"
              @click.native="close"
            />
          </v-col>
          <v-col
            v-if="!closeOnly"
            cols="12"
            sm="7"
            class="text-left"
            order="1"
            order-sm="2"
          >
            <mew-button
              btn-size="xlarge"
              :title="btnText"
              :disabled="!btnEnabled"
              :has-full-width="$vuetify.breakpoint.xs"
              @click.native="btnAction"
            />
          </v-col>
          <v-col v-if="closeOnly" cols="12" class="text-left">
            <mew-button
              btn-size="xlarge"
              title="Close"
              :has-full-width="true"
              @click.native="close"
            />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
    <v-sheet v-else class="py-6 px-5 px-8 position--relative">
      <v-btn icon class="header-close-icon">
        <v-icon size="x-large" color="grey cursor--pointer" @click="close">
          mdi-close
        </v-icon>
      </v-btn>
      <!--
        =====================================================================================
          Dialog Header
        =====================================================================================
        -->
      <v-row class="header-container">
        <v-col cols="12" align-self="center">
          <div class="mew-heading-2 text-center">{{ title }}</div>
        </v-col>
      </v-row>
      <!--
        =====================================================================================
          Dialog Body
        =====================================================================================
        -->
      <div>
        <slot name="dialogBody">
          <div>This is a test value</div>
        </slot>
      </div>
      <!--
        =====================================================================================
          Dialog action
        =====================================================================================
        -->
      <v-row v-if="hasButtons" class="mt-2" justify="space-around">
        <v-col
          v-if="!closeOnly"
          cols="12"
          sm="5"
          class="text-right"
          order="2"
          order-sm="1"
        >
          <mew-button
            btn-style="outline"
            btn-size="xlarge"
            title="Cancel"
            :has-full-width="$vuetify.breakpoint.xs"
            @click.native="close"
          />
        </v-col>
        <v-col
          v-if="!closeOnly"
          cols="12"
          sm="7"
          class="text-left"
          order="1"
          order-sm="2"
        >
          <mew-button
            btn-size="xlarge"
            :title="btnText"
            :disabled="!btnEnabled"
            :has-full-width="$vuetify.breakpoint.xs"
            @click.native="btnAction"
          />
        </v-col>
        <v-col v-if="closeOnly" cols="12" class="text-left">
          <mew-button
            btn-size="xlarge"
            title="Close"
            :has-full-width="true"
            @click.native="close"
          />
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    close: {
      type: Function,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    btnEnabled: {
      type: Boolean,
      default: true
    },
    btnAction: {
      type: Function,
      default: () => {}
    },
    btnText: {
      type: String,
      default: 'Confirm & Send'
    },
    closeOnly: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '600'
    },
    hasButtons: {
      type: Boolean,
      default: true
    },
    isPersistent: {
      type: Boolean,
      default: true
    },
    /**
     * NOTE:
     * This prop will allow scroll anchoring for vuetify.goTo() inside scrollable content
     * Important if you are using this prop please put v-card-text inside slot dgialogBody.
     * For an example on how to use vuetify.goTo() see ModuleConfirmation.
     *    <template #dialogBody>
     *        <v-card-text ref="scrollableContent" class="py-0 px-5 px-md-0">
     *          ...... your content ....
     *        </v-card-text>
     * <template>
     */
    anchored: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClickOutside() {
      //this.$emit('close');
      this.close();
    }
  }
};
</script>

<style lang="scss">
.core--components--app-modal {
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.header-close-icon {
  right: 10px;
  top: 10px;
  position: absolute;
}
</style>
