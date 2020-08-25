<template>
  <Tabs :tabs="tabs" />
</template>

<script>
import Tabs from '@/web/components/Tabs/TabsTypeB';
import Send from './components/Send';
import Swap from './components/Swap';
import Dapps from './components/Dapps';
import Tokens from './components/Tokens';
import More from './components/More';

export default {
  name: 'TabContent',
  components: { Tabs },
  data: () => {
    return {
      tabs: [
        { label: 'Send', content: Send },
        { label: 'Swap', content: Swap },
        { label: 'Dapps', content: Dapps },
        { label: 'Tokens', content: Tokens },
        { label: 'More', content: More }
      ]
    };
  }
};
</script>
