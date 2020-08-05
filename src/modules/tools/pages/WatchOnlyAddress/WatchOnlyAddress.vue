<template>
  <div>
    <BlockTitle no-page-title :data="title" class="mb-7" />
    <table-container />
  </div>
</template>

<script>
import BlockTitle from '@/components/block-title';
import tableContainer from '../../components/table-container';

export default {
  components: { BlockTitle, tableContainer },
  data: () => ({
    title: {
      title: 'Watch only address',
      description:
        'This is a recommended way to view your balance. You can only view your balance via this option.'
    }
  })
};
</script>

<style lang="scss" scoped></style>
