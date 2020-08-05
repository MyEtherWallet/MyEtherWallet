<template>
  <div>
    <home-header title="How it works" />
    <tab-content class="pb-8" />
    <swap class="pt-8" />
    <dapps-center />
    <tokens class="pb-3" />
    <more class="py-3" />
    <get-started class="pt-3" />
  </div>
</template>

<script>
import homeHeader from '@/components/home-header';
import tabContent from './components/tab-content';
import swap from './components/swap';
import dappsCenter from './components/dapps-center';
import tokens from './components/tokens';
import more from './components/more';
import getStarted from '@/components/get-started';

export default {
  name: 'HowItWorks',
  components: {
    homeHeader,
    tabContent,
    swap,
    dappsCenter,
    tokens,
    more,
    getStarted
  }
};
</script>
