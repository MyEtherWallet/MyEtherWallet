<template>
  <div class="pt-10">
    <BlockTitle :title="titleText" centered />
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleText: 'All-in-one gateway to your Ethereum Blockchain service'
  })
};
</script>

<style lang="scss" scoped></style>
