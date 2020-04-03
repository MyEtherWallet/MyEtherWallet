<template>
  <v-overlay
    color="overlayBackground"
    opacity="1"
    :value="open"
    z-index="100"
    class="theme--light-text--dark-space theme--dark-text--blue"
  >
    <div v-if="back" class="overlay-back-button">
      <BackButton text="Back" />
    </div>
    <div class="overlay-close-button">
      <CloseButton :text="closeText" @click.native="close" />
    </div>
    <div class="overlay-content-block d-flex flex-column align-center py-10">
      <slot />
    </div>
  </v-overlay>
</template>

<script>
import CloseButton from '@/components/Buttons/CloseButton';
import BackButton from '@/components/Buttons/BackButton';

export default {
  components: { CloseButton, BackButton },
  props: {
    back: { default: false, type: Boolean },
    closeText: { default: '', type: String },
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {};
  },
  watch: {
    open(val) {
      if (val === true) {
        // Set html element unscrollable
        document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
      } else {
        // Set html element scrollable
        document.getElementsByTagName('html')[0].style.overflowY = 'initial';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

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

.overlay-content-block {
  max-height: 100vh;
  overflow-y: scroll;
  width: 100vw;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
