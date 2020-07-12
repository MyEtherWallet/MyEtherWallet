<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <SignMessage />
      </div>
      <Spacer />
      <div>
        <Tips />
      </div>
    </div>
  </div>
</template>

<script>
import Spacer from '@/web/components/Common/Spacer';
import SignMessage from './SignMessage';
import Tips from '@/web/components/Tips';

export default {
  components: {
    Spacer,
    SignMessage,
    Tips
  }
};
</script>
