<template>
  <div class="block-title" :class="centered ? 'text-center' : ''">
    <div
      class="top-title text-uppercase font-weight-bold grey--text text--lighten-1 mb-2"
    >
      {{ title }}
    </div>
    <div class="top-description font-weight-bold">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: 'BlockTitle',
  props: {
    title: { default: '', type: String },
    description: { default: '', type: String },
    centered: { default: false, type: Boolean }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

.top-title {
  letter-spacing: -0.3px;
  font-size: 16px;
}
.top-description {
  letter-spacing: -1px;
  font-size: 30px;
  line-height: 36px;
  max-width: 450px;
  display: inline-block;
}
</style>
