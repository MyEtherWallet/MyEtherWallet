<template>
  <div>
    <TopBanner />
    <div class="py-6" />
    <Features />
    <div class="py-6" />
    <WhyMew />
    <div class="py-5" />
    <Ad />
    <div class="py-11" />
    <Partners />
    <div class="py-9" />
    <Ad />
    <div class="py-1" />
  </div>
</template>

<script>
// import TopBanner from './components/TopBanner';
// import Features from './components/Features';
// import WhyMew from './components/WhyMew';
// import Ad from '../components/Ad';
// import Partners from '../components/Partners';

export default {
  name: 'Home',
  components: {
    TopBanner,
    Features,
    WhyMew,
    Ad,
    Partners
  }
};
</script>
