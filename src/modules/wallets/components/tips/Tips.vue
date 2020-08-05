<template>
  <mew6-white-sheet sideinfo class="px-7 py-5">
    <div>
      <div class="d-flex align-center justify-space-between width--100-percent">
        <div class="d-flex align-center">
          <div v-if="text" class="title font-weight-bold mr-2">Tips</div>
          <slot name="object-next-to-title" />
        </div>
        <slot name="right-button" />
      </div>
      <div class="mt-3">
        <div>
          Include your nickname and where you use the nickname so someone else
          cannot use it. Include a specific reason for the message so it cannot
          be reused for a different purpose.
        </div>
      </div>
    </div>
  </mew6-white-sheet>
</template>

<script>
import BlockTitle from './components/BlockTitle2';

export default {
  components: { BlockTitle },
  data() {
    return {};
  }
};
</script>
