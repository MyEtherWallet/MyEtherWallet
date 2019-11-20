<template>
  <div class="block-title" :class="centered ? 'text-center' : ''">
    <div
      v-if="toptitle"
      class="top-title text-uppercase font-weight-bold grey--text text--lighten-1 mb-2"
    >
      {{ toptitle }}
    </div>
    <h2 v-if="title" class="top-description">{{ title }}</h2>
    <div v-if="description" class="mt-2">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: 'BlockTitle',
  props: {
    toptitle: { default: '', type: String },
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
  max-width: 450px;
  display: inline-block;
}
</style>
