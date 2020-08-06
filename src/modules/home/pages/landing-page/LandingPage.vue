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
import landing from '../../components/landing/Landing';
import features from '../../components/features/Features';
import whyMew from '../../components/why-mew/WhyMew';
import join from '@/components/join/Join';
import getStarted from '@/components/get-started/GetStarted';
import partners from '@/components/partners/Partners';

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
