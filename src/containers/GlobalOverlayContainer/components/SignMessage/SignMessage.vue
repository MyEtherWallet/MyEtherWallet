<template>
  <div>
    <sign-message-confirmation
      :open="openSignMessageConfirmation"
      :close="closeSignMessageConfirmation"
    />
  </div>
</template>

<script>
import signMessageConfirmation from './SignMessageConfirmation/SignMessageConfirmation';

export default {
  components: {
    signMessageConfirmation
  },
  methods: {}
};
</script>
