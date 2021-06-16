<template>
  <v-dialog
    :max-width="width"
    :value="show"
    :fullscreen="scrollable ? $vuetify.breakpoint.xs : false"
    content-class="core--components--app-modal"
    :scrollable="scrollable"
    @click:outside="handleClickOutside"
  >
    <v-card v-if="scrollable" color="white" class="py-0 px-5 px-md-11">
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
        Dialog Body
      =====================================================================================
      -->
      <v-card-text class="py-0 px-5 px-md-0">
        <slot name="dialogBody">
          <div>This is a test value</div>
        </slot>
      </v-card-text>
      <!--
      =====================================================================================
        Dialog action
      =====================================================================================
      -->
      <v-card-actions class="py-5 py-md-8">
        <v-row v-if="!noBtn" class="pa-0" justify="space-around" dense>
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
      <v-row v-if="!noBtn" class="mt-5 mt-sm-8" justify="space-around" dense>
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
    noBtn: {
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
