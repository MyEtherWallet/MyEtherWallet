<template>
  <mew-tabs :items="mewTabs">
    <template v-slot:tabContent1>
      <send />
    </template>
    <template v-slot:tabContent2>
      <swap />
    </template>
    <template v-slot:tabContent3>
      <dapps />
    </template>
    <template v-slot:tabContent4>
      <tokens />
    </template>
    <template v-slot:tabContent5>
      <more />
    </template>
  </mew-tabs>
</template>

<script>
import send from './components/send/Send';
import swap from './components/swap/Swap';
import dapps from './components/dapps/Dapps';
import tokens from './components/tokens/Tokens';
import more from './components/more/More';

export default {
  name: 'TabContent',
  components: { send, swap, dapps, tokens, more },
  data: () => {
    return {
      mewTabs: [
        {
          name: 'send'
        },
        {
          name: 'swap'
        },
        {
          name: 'dapps'
        },
        {
          name: 'tokens'
        },
        {
          name: 'more'
        }
      ]
    };
  }
};
</script>
