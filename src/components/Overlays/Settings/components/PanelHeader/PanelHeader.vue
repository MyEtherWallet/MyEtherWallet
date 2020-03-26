<template>
  <div class="d-flex align-center">
    <div v-if="title" class="headline font-weight-bold mr-3">{{ title }}</div>
    <div v-if="subtitle" class="subtitle-color">{{ subtitle }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: { default: '', type: String },
    subtitle: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.subtitle-color {
  color: $gray-4;
}
</style>
