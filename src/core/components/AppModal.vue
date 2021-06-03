<template>
  <v-dialog max-width="500" :value="show" @click:outside="handleClickOutside">
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
      <v-row class="mt-2">
        <v-col cols="12" class="text-center">
          <mew-button
            btn-size="xlarge"
            :title="btnText"
            :disabled="!btnEnabled"
            @click.native="btnAction"
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
    }
  },
  methods: {
    handleClickOutside() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  position: relative;
  .header-close-icon {
    right: 5px;
    position: absolute;
  }
}
</style>
