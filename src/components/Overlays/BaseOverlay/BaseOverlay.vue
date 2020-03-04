<template>
  <v-overlay :color="backgroundColor" opacity="1" :value="open" z-index="100">
    <div class="overlay-close-button">
      <CloseButton :text="closeText" @click.native="close" />
    </div>
    <slot />
  </v-overlay>
</template>

<script>
import Var from '@/variables.js';
import CloseButton from '@/components/Buttons/CloseButton';

export default {
  components: { CloseButton },
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
    return {
      backgroundColor: Var.colorSets.lightMint
    };
  }
};
</script>

<style lang="scss" scoped>
.v-overlay {
  border-radius: 0;
}

.overlay-close-button {
  position: fixed;
  top: 50px;
  right: 70px;
}
</style>
