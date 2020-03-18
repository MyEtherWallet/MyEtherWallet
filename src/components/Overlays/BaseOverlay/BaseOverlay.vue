<template>
  <v-overlay
    color="overlayBackground"
    opacity="1"
    :value="open"
    z-index="100"
    light
    :class="$vuetify.theme.dark ? 'dark-theme' : 'light-theme'"
  >
    <div class="overlay-back-button">
      <BackButton text="Back" />
    </div>
    <div class="overlay-close-button">
      <CloseButton :text="closeText" @click.native="close" />
    </div>
    <slot />
  </v-overlay>
</template>

<script>
import CloseButton from '@/components/Buttons/CloseButton';
import BackButton from '@/components/Buttons/BackButton';

export default {
  components: { CloseButton, BackButton },
  props: {
    closeText: { default: '', type: String },
    open: { default: false, type: Boolean },
    close: {
      default: function() {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.light-theme {
  color: $dark-space !important;
}

.dark-theme {
  color: $blue-1 !important;
}

.v-overlay {
  border-radius: 0;
}

.overlay-close-button {
  position: fixed;
  top: 50px;
  right: 70px;
}

.overlay-back-button {
  position: fixed;
  top: 50px;
  left: 70px;
}
</style>
