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
import send from './components/send';
import swap from './components/swap';
import dapps from './components/dapps';
import tokens from './components/tokens';
import more from './components/more';

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
