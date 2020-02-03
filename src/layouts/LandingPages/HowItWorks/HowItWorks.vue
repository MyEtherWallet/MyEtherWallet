<template>
  <div>
    <PageTitle title="How it works" />
    <div class="py-3" />
    <TabContent />
    <div class="py-3" />
    <Swap />
    <Dapps />
    <Tokens />
    <div class="py-3" />
    <MoreTools />
    <div class="py-3" />
    <Ad2 />
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle';
import TabContent from './components/TabContent';
import Swap from './components/Swap';
import Dapps from './components/Dapps';
import Tokens from './components/Tokens';
import MoreTools from './components/MoreTools';
import Ad2 from '../components/Ad2';

export default {
  name: 'HowItWorks',
  components: { PageTitle, TabContent, Swap, Dapps, Tokens, MoreTools, Ad2 }
};
</script>
