<template>
  <div class="title-text-contents">
    <div v-if="options.title" class="title-block">
      <div class="title">
        <img v-if="options.titleIcon" :src="options.titleIcon" />
        <span>{{ options.title }}</span>
      </div>
    </div>
    <div v-if="options.boldSubTitle" class="bold-sub-title">
      {{ options.boldSubTitle }}
    </div>
    <div v-if="options.textContent" class="text-content">
      <p v-for="text in options.textContent" :key="text.key">{{ text }}</p>
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
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'TitleTextContentsLayout.scss';
</style>
