<template>
  <mew6-white-sheet sideinfo class="px-7 py-5">
    <div>
      <BlockTitle text="Tips" />
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
import BlockTitle from '@/web/components/BlockTitles/BlockTitle2';

export default {
  components: { BlockTitle },
  data() {
    return {};
  }
};
</script>
