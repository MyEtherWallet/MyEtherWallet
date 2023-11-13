<template>
  <div>
    <home-landing />
    <home-features />
    <home-enkrypt />
    <home-eth-blocks />
    <home-socials />
    <home-why-mew />
    <mewtopia-block />
    <partners-block />
    <get-started />
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
    GetStarted: () => import('../components-default/GetStarted'),
    MewtopiaBlock: () => import('../components-default/MewtopiaBlock'),
    PartnersBlock: () => import('../components-default/PartnersBlock')
  }
};
</script>
