<template>
  <mew-tabs :items="mewTabs">
    <template v-slot:tabContent0>
      <Send />
    </template>
    <template v-slot:tabContent1>
      <Swap />
    </template>
    <template v-slot:tabContent2>
      <Dapps />
    </template>
    <template v-slot:tabContent3>
      <Tokens />
    </template>
    <template v-slot:tabContent4>
      <More />
    </template>
  </mew-tabs>
</template>

<script>
import Send from './components/Send';
import Swap from './components/Swap';
import Dapps from './components/Dapps';
import Tokens from './components/Tokens';
import More from './components/More';

export default {
  name: 'TabContent',
  components: { Send, Swap, Dapps, Tokens, More },
  data: () => {
    return {
      mewTabs: [
        {
          name: 'Send'
        },
        {
          name: 'Swap'
        },
        {
          name: 'Dapps'
        },
        {
          name: 'Tokens'
        },
        {
          name: 'More'
        }
      ]
    };
  }
};
</script>
