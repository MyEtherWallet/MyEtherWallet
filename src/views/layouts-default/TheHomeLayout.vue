<template>
  <div>
    <home-landing />
    <home-features />
    <home-enkrypt />
    <home-eth-blocks />
    <home-socials />
    <home-why-mew />
    <app-mewtopia-block />
    <app-partners-block />
    <app-get-started />
  </div>
</template>

<script>
import HomeEnkrypt from '../components-default/HomeEnkrypt';
import HomeLanding from '../components-default/HomeLanding';
import HomeFeatures from '../components-default/HomeFeatures';
import HomeEthBlocks from '../components-default/HomeEthBlocks';
import HomeSocials from '../components-default/HomeSocials.vue';
import HomeWhyMew from '../components-default/HomeWhyMew';
import AppMewtopiaBlock from '@/core/components/AppMewtopiaBlock';
import AppGetStarted from '@/core/components/AppGetStarted';
import AppPartnersBlock from '@/core/components/AppPartnersBlock';

export default {
  name: 'TheHomeLayout',
  components: {
    HomeEnkrypt,
    HomeLanding,
    HomeFeatures,
    HomeEthBlocks,
    HomeSocials,
    HomeWhyMew,
    AppMewtopiaBlock,
    AppGetStarted,
    AppPartnersBlock
  }
};
</script>
