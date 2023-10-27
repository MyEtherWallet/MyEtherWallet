<template>
  <div>
    <ad-banner />
    <ad-prototype />
    <ad-form />
  </div>
</template>

<script>
export default {
  name: 'AdvertiseWithUsLanding',
  components: {
    AdBanner: () => import('@/views/components-default/AdBanner.vue'),
    AdPrototype: () => import('@/views/components-default/AdPrototype.vue'),
    AdForm: () => import('@/views/components-default/AdForm.vue')
  }
};
</script>
