<template>
  <div>
    <landing />
    <features class="pt-12 pb-6" />
    <why-mew class="py-6" />
    <join class="py-5" />
    <partners class="py-11" />
    <get-started class="py-9" />
  </div>
</template>

<script>
import landing from './components/landing';
import features from './components/features';
import whyMew from './components/why-mew';
import join from '@/components/join';
import getStarted from '@/components/get-started';
import partners from '@/components/partners';

export default {
  name: 'Home',
  components: {
    landing,
    features,
    whyMew,
    join,
    getStarted,
    partners
  }
};
</script>
