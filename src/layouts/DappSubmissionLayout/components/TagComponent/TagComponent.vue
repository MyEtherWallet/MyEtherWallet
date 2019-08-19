<template>
  <div ref="tagContainer" class="tag-container">
    {{ name }} <span @click="deleteFunc(idx)"><i class="fa fa-times"/></span>
  </div>
</template>

<script>
export default {
  props: {
    deleteFunc: {
      type: Function,
      default: () => {}
    },
    name: {
      type: String,
      default: ''
    },
    idx: {
      type: Number,
      default: 0
    }
  },
};
</script>

<style lang="scss" scoped>
@import 'TagComponent.scss';
</style>
