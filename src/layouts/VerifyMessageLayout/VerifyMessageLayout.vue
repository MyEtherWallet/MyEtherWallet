<template>
  <div class="verify-message-layout">
    <div class="verify-message-content">
      <h2>Verify Message</h2>
      <p>
        Customize actions, debug reveals, and more with this set of advance
        tools. Please be mindful of the capabilities and limitations of these
        tools before using.
      </p>
      <verify-message-input />
    </div>
  </div>
</template>

<script>
import VerifyMessageInput from '@/components/VerifyMessageInput';
export default {
  components: {
    'verify-message-input': VerifyMessageInput
  }
};
</script>

<style lang="scss" scoped>
@import 'VerifyMessageLayout.scss';
</style>
