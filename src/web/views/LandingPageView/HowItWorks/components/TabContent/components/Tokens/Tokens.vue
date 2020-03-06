<template>
  <div>
    <div class="py-7" />
    <BlockTitle :title="titleText" centered />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleText: 'All-in-one gateway to your Ethereum Blockchain service'
  })
};
</script>
