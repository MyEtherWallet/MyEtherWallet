<template>
  <div>
    <SignMessageConfirmation
      :open="openSignMessageConfirmation"
      :close="closeSignMessageConfirmation"
    />
  </div>
</template>

<script>
import SignMessageConfirmation from './SignMessageConfirmation';

export default {
  components: {
    SignMessageConfirmation
  },
  methods: {
  }
};
</script>
