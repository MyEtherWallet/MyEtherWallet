<template>
  <div>
    <v-container>
      <BlockTitle :data="titleData" />
    </v-container>
    <Tabs :tabs="tabs" />
  </div>
</template>

<script>
import Tabs from '@/web/components/Tabs';
import BlockTitle from '@/web/components/BlockTitle';

export default {
  name: 'HomeFeatures',
  components: {
    Tabs,
    BlockTitle
  },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: 'Features',
      title: 'All-in-one gateway to your Ethereum Blockchain service',
      description: '',
      centered: true
    },
    tabs: [
      {
        label: 'Send',
        background: require('@/assets/images/backgrounds/bg-swap-page.svg')
      },
      {
        label: 'Swap',
        background: require('@/assets/images/backgrounds/bg-swap-page.svg')
      },
      {
        label: 'Dapps',
        background: require('@/assets/images/backgrounds/bg-swap-page.svg')
      },
      {
        label: 'Tokens',
        background: require('@/assets/images/backgrounds/bg-swap-page.svg')
      }
    ]
  })
};
</script>
