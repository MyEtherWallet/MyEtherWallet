<template>
  <div class="d-flex">
    <div v-if="icon" class="mr-3 pt-1">
      <img style="opacity: 0.7;" :src="icon" width="30" />
    </div>
    <div>
      <div v-if="text1" class="text-uppercase">{{ text1 }}</div>
      <div v-if="text2" class="display-1">{{ text2 }}</div>
      <div v-if="text3" class="text-color--mew-green">{{ text3 }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      default: function() {
        return {};
      },
      type: Object
    },
    text1: { default: '', type: String },
    text2: { default: '', type: String },
    text3: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
