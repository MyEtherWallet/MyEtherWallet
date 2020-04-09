<template>
  <WhiteSheet overflow-hidden>
    <div class="d-flex align-center flex-grow-1">
      <slot />
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';

export default {
  components: { WhiteSheet },
  props: {},
  data() {
    return {};
  }
};
</script>
