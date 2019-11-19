<template>
  <div>
    <PageTitle title="How it works" />
    <TabContent />
  </div>
</template>

<script>
import PageTitle from '@/layouts/components/PageTitle';
import TabContent from './components/TabContent';

export default {
  name: 'HowItWorks',
  components: { PageTitle, TabContent }
};
</script>
