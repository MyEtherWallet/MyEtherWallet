<template>
  <div class="verify-message-layout">
    <div class="page-container">
      <div class="title-block">
        <h2>{{ $t('verifyMessage.title') }}</h2>
        <p>
          {{ $t('verifyMessage.page-desc') }}
        </p>
      </div>
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
