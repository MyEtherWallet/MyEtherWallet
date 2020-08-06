<template>
  <div>
    <home-header title="How it works" />
    <mew-tabs :items="mewTabs">
      <template v-slot:tabContent1>
        <send />
      </template>
      <template v-slot:tabContent2>
        <swap />
      </template>
      <template v-slot:tabContent3>
        <dapps-center />
      </template>
      <template v-slot:tabContent4>
        <tokens />
      </template>
      <template v-slot:tabContent5>
        <more />
      </template>
    </mew-tabs>
    <get-started />
  </div>
</template>

<script>
import homeHeader from '@/components/home-header/HomeHeader';
import swap from './components/swap/Swap';
import send from './components/send/Send';
import dappsCenter from './components/dapps-center/DappsCenter';
import tokens from './components/tokens/Tokens';
import more from './components/more/More';
import getStarted from '@/components/get-started/GetStarted';

export default {
  name: 'HowItWorks',
  components: {
    homeHeader,
    swap,
    send,
    dappsCenter,
    tokens,
    more,
    getStarted
  },
  data() {
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
