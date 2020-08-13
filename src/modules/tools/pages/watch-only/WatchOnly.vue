<template>
  <div>
    <block-title no-page-title :data="title" class="mb-7" />
    <table-container />
    <div class="py-3">
      <address-select label="To address" :items="addresses"></address-select>
      <mew-input label="Address name" placeholder=" " />
      <mew-button
        title="Add"
        button-size="xlarge"
        class="mt-3 mx-auto display--block"
      />
    </div>
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';
import tableContainer from '../../components/table-container/TableContainer';

export default {
  components: { blockTitle, tableContainer },
  data: () => ({
    addresses: [
      {
        address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
        currency: 'ETH',
        nickname: 'My Address',
        resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      },
      {
        address: '0x43689531907482BEE7e650D18411E284A7337A66',
        currency: 'ETH',
        nickname: 'nickname',
        resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      }
    ],
    title: {
      title: 'Watch only address',
      description:
        'This is a recommended way to view your balance. You can only view your balance via this option.'
    }
  })
};
</script>

<style lang="scss" scoped></style>
