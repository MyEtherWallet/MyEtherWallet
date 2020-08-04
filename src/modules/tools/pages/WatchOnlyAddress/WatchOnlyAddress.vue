<template>
  <div>
    <BlockTitle no-page-title :data="title" class="mb-7" />
    <TableContainer />
  </div>
</template>

<script>
import BlockTitle from '@/components/BlockTitle';
// import TableContainer from '../components/TableContainer';

export default {
  components: { BlockTitle },
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
