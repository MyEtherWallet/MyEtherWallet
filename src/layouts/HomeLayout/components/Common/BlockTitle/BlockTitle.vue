<template>
  <div class="block-title" :class="center ? 'text-center' : ''">
    <div
      class="title text-uppercase font-weight-bold grey--text text--lighten-1"
    >
      {{ title }}
    </div>
    <div class="display-1 font-weight-bold">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: 'BlockTitle',
  props: {
    title: { default: '', type: String },
    description: { default: '', type: String },
    center: { default: false, type: Boolean }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

.subtitle-1 {
  letter-spacing: -0.3px;
}
</style>
