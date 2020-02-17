<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    buttonclass: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';

ul {
  display: flex;
  align-items: center;
  li {
    list-style: none;
    margin-right: 20px;
  }
}
</style>
