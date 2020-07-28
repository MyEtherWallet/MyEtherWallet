<template>
  <div>
    <SignMessageConfirmation
      :open="openSignMessageConfirmation"
      :close="closeSignMessageConfirmation"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SignMessageConfirmation from './SignMessageConfirmation';

export default {
  components: {
    SignMessageConfirmation
  },
  computed: mapState({
    openSignMessageConfirmation: state =>
      state.overlays.SignMessageConfirmation.isOpen
  }),
  methods: {
    closeSignMessageConfirmation() {
      this.$store.commit('closeOverlay', 'SignMessageConfirmation');
    }
  }
};
</script>
