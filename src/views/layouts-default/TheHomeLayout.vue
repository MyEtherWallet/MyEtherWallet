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
export default {
  name: 'TheHomeLayout',
  components: {
    HomeEnkrypt: () => import('../components-default/HomeEnkrypt'),
    HomeLanding: () => import('../components-default/HomeLanding'),
    HomeFeatures: () => import('../components-default/HomeFeatures'),
    HomeEthBlocks: () => import('../components-default/HomeEthBlocks'),
    HomeSocials: () => import('../components-default/HomeSocials.vue'),
    HomeWhyMew: () => import('../components-default/HomeWhyMew'),
    AppMewtopiaBlock: () => import('@/core/components/AppMewtopiaBlock'),
    AppGetStarted: () => import('@/core/components/AppGetStarted'),
    AppPartnersBlock: () => import('@/core/components/AppPartnersBlock')
  }
};
</script>
