<template>
  <v-dialog
    max-width="600"
    :value="show"
    content-class="core--components--app-modal"
    @click:outside="handleClickOutside"
  >
    <v-sheet class="py-6 px-4">
      <!--
        =====================================================================================
          Dialog Header
        =====================================================================================
        -->
      <v-row class="header-container">
        <v-col cols="12" align-self="center">
          <p class="mew-heading-2 text-center">{{ title }}</p>
        </v-col>
        <div class="header-close-icon">
          <v-icon size="large" color="grey cursor--pointer" @click="close"
            >mdi-close</v-icon
          >
        </div>
      </v-row>
      <!--
        =====================================================================================
          Dialog Body
        =====================================================================================
        -->
      <slot name="dialogBody">
        <div>This is a test value</div>
      </slot>
      <!--
        =====================================================================================
          Dialog action
        =====================================================================================
        -->
      <v-row v-if="!noBtn" class="mt-2" justify="space-around">
        <v-col v-if="!closeOnly" cols="5" class="text-right">
          <mew-button
            btn-style="outline"
            btn-size="xlarge"
            title="Cancel"
            @click.native="close"
          />
        </v-col>
        <v-col v-if="!closeOnly" cols="7" class="text-left">
          <mew-button
            btn-size="xlarge"
            :title="btnText"
            :disabled="!btnEnabled"
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
      default: 'Confirm and Send'
    },
    closeOnly: {
      type: Boolean,
      default: false
    },
    noBtn: {
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
.header-container {
  position: relative;
  .header-close-icon {
    right: 5px;
    position: absolute;
  }
}
</style>
