<template>
  <div>
    <TopBanner />
    <div class="py-6" />
    <Features />
    <div class="py-6" />
    <WhyMew />
    <div class="py-5" />
    <Ad1 />
    <div class="py-11" />
    <Partners />
    <div class="py-9" />
    <Ad2 />
    <div class="py-1" />
  </div>
</template>

<script>
import TopBanner from './components/TopBanner';
import Features from './components/Features';
import WhyMew from './components/WhyMew';
import Ad1 from '@/web/components/HomeAd1';
import Ad2 from '@/web/components/HomeAd2';
import Partners from '@/web/components/Partners';

export default {
  name: 'Home',
  components: {
    TopBanner,
    Features,
    WhyMew,
    Ad1,
    Ad2,
    Partners
  }
};
</script>
