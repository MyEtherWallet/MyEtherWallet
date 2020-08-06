<template>
  <div>
    <block-title no-page-title :data="title" class="mb-7" />
    <table-container />
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import tableContainer from '../../components/table-container/TableContainer';

export default {
  components: { blockTitle, tableContainer },
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
