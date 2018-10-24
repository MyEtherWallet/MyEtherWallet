<template>
  <div class="title-text-contents">
    <div class="title" v-if="options.title">{{options.title}}</div>
    <div class="bold-sub-title" v-if="options.boldSubTitle">{{options.boldSubTitle}}</div>
    <div class="text-content" v-if="options.textContent">
      <p v-for="text in options.textContent" :key="text.key">
        {{text}}
      </p>    
    </div>
  </div>
</template>

<script>

export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {

    };
  }
};
</script>

<style lang="scss" scoped>
@import 'TitleTextContentsLayout.scss';
</style>
