<template functional>
  <div class="title-text-contents">
    <div v-if="props.options.title" class="title-block">
      <div class="title">
        <img
          v-if="props.options.titleIcon"
          :src="props.options.titleIcon"
          alt
        />
        <span>{{ props.options.title }}</span>
      </div>
    </div>
    <div v-if="props.options.boldSubTitle" class="bold-sub-title">
      {{ props.options.boldSubTitle }}
    </div>
    <div v-if="props.options.textContent" class="text-content">
      <p v-for="text in props.options.textContent" :key="text.key">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PageTitleComponent.scss';
</style>
