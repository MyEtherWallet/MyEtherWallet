<template>
  <div class="block-title" :class="data.centered ? 'text-center' : ''">
    <div
      v-if="data.toptitle"
      class="top-title text-uppercase font-weight-bold grey--text text--lighten-1 mb-2"
      :class="data.textProps"
    >
      {{ data.toptitle }}
    </div>
    <h2 v-if="data.title" class="top-description" :class="data.textProps">
      {{ data.title }}
    </h2>
    <div class="mt-3" />
    <p v-if="data.description" :class="data.textProps" class="ma-0">
      {{ data.description }}
    </p>
    <div><slot /></div>
  </div>
</template>

<script>
export default {
  name: 'BlockTitle',
  props: {
    data: {
      default: function() {
        return {};
      },
      type: Object
    }
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
