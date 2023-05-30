<template>
  <div>
    <router-view />
    <prototype-layout-component class="mt-4" />
  </div>
</template>

<script>
export default {
  components: {
    PrototypeLayoutComponent: () =>
      import('@/core/components/PrototypeLayoutComponent.vue')
  }
};
</script>
