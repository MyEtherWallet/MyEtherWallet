<template>
  <div>
    <PageTitle title="How it works" />
    <TabContent />
    <div class="py-8" />
    <Swap />
    <Dapps />
    <Tokens />
    <div class="py-3" />
    <MoreTools />
    <div class="py-3" />
    <Ad />
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import TabContent from './components/TabContent';
import Swap from './components/Swap';
import Dapps from './components/Dapps';
import Tokens from './components/Tokens';
import MoreTools from './components/MoreTools';
import Ad from '@/components/HomeAd2';

export default {
  name: 'HowItWorks',
  components: { PageTitle, TabContent, Swap, Dapps, Tokens, MoreTools, Ad }
};
</script>
