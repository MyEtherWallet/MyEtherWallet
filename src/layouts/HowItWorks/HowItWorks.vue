<template>
  <div>
    <PageTitle />
    <Tabs />
  </div>
</template>

<script>
import PageTitle from '@/layouts/components/PageTitle';
import Tabs from './components/Tabs';

export default {
  name: 'HowItWorks',
  components: { PageTitle, Tabs }
};
</script>
