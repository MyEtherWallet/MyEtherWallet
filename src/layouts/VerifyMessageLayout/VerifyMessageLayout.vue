<template functional>
  <div class="verify-message-layout">
    <div class="page-container">
      <div class="title-block">
        <h2>{{ parent.$t('verifyMessage.title') }}</h2>
        <p>
          {{ parent.$t('verifyMessage.page-desc') }}
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
