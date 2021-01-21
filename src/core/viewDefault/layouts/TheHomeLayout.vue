<template>
  <div>
    <home-landing />
    <home-features />
    <home-why-mew />
    <join />
    <partners />
    <get-started />
  </div>
</template>

<script>
import HomeLanding from '../components/homeLayout/HomeLanding';
import HomeFeatures from '../components/homeLayout/HomeFeatures';
import HomeWhyMew from '../components/homeLayout/HomeWhyMew';
import join from '@/components/join/Join';
import getStarted from '@/components/get-started/GetStarted';
import partners from '@/components/partners/Partners';

export default {
  name: 'TheHomeLayout',
  components: {
    HomeLanding,
    HomeFeatures,
    HomeWhyMew,
    join,
    getStarted,
    partners
  }
};
</script>
