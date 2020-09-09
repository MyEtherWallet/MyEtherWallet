<template>
  <div>
    <landing />
    <div class="py-10" />

    <features />
    <div class="py-12" />
    <div class="py-6" />

    <why-mew />
    <div class="py-12" />

    <join />
    <div class="py-12" />

    <partners />
    <div class="py-12" />

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
