<template>
  <div class="mew6-component--top-right-btn cursor--pointer">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'TopRightBtn',
  props: {
    text: { default: '', type: String }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.mew6-component--top-right-btn {
  color: var(--v-primaryActive-base);
  display: inline-block;
  position: absolute;
  top: -12px;
  right: 20px;
  &:hover {
    color: var(--v-greenPrimary-base);
  }
}
</style>
