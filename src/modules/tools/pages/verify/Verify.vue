<template>
  <div>
    <block-title max-width="600px" no-page-title :data="title" class="mb-7" />
    <v-textarea outlined label="Signature" value="Value"></v-textarea>
    <mew-button
      title="Verify"
      btn-size="xlarge"
      class="display--block mx-auto mt-5"
    />
    <mew-button
      btn-style="transparent"
      title="Clean all"
      btn-size="small"
      class="display--block mx-auto mt-5"
    />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  components: { blockTitle },
  data: () => ({
    title: {
      title: 'Verify message',
      description:
        'This is a recommended way to view your balance. You can only view your balance via this option.'
    }
  })
};
</script>

<style lang="scss" scoped></style>
