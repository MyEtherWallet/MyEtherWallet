<template>
  <div>
    <landing />
    <features />
    <why-mew />
    <join />
    <partners />
    <get-started />
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
  name: 'LandingPage',
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
