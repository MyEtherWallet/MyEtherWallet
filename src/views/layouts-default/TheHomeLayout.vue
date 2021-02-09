<template>
  <div>
    <home-landing />
    <home-features />
    <home-why-mew />
    <app-mewtopia-block />
    <partners />
    <app-get-started />
  </div>
</template>

<script>
import HomeLanding from '../components-default/HomeLanding';
import HomeFeatures from '../components-default/HomeFeatures';
import HomeWhyMew from '../components-default/HomeWhyMew';
import AppMewtopiaBlock from '@/core/components/AppMewtopiaBlock';
import AppGetStarted from '@/core/components/AppGetStarted';
import partners from '@/components/partners/Partners';

export default {
  name: 'TheHomeLayout',
  components: {
    HomeLanding,
    HomeFeatures,
    HomeWhyMew,
    AppMewtopiaBlock,
    AppGetStarted,
    partners
  }
};
</script>
