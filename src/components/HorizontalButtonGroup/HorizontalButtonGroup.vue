<template>
  <div class="horizontal-button-group">
    <ul class="flex--row--align-center">
      <li v-for="button in buttons" :key="button.key">
        <img :src="button.icon" />
        <h4>{{ button.title }}</h4>
        <p>{{ button.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    buttons: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'HorizontalButtonGroup.scss';
</style>
