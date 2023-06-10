<template>
  <div>
    <ad-banner />
    <ad-prototype />
    <ad-form />
  </div>
</template>

<script>
import AdBanner from '@/views/components-default/AdBanner.vue';
import AdPrototype from '@/views/components-default/AdPrototype.vue';
import AdForm from '@/views/components-default/AdForm.vue';

export default {
  name: 'AdvertiseWithUsLanding',
  components: {
    AdBanner,
    AdPrototype,
    AdForm
  }
};
</script>
