<template functional>
  <div class="verify-message-layout">
    <div class="page-container">
      <div class="title-block">
        <h2>Verify Message</h2>
        <p>
          Customize actions, debug reveals, and more with this set of advance
          tools. Please be mindful of the capabilities and limitations of these
          tools before using.
        </p>
      </div>
      <component :is="injections.components.VerifyMessageInput" />
    </div>
  </div>
</template>

<script>
import VerifyMessageInput from '@/components/VerifyMessageInput';
export default {
  inject: {
    components: {
      default: {
        VerifyMessageInput
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'VerifyMessageLayout.scss';
</style>
