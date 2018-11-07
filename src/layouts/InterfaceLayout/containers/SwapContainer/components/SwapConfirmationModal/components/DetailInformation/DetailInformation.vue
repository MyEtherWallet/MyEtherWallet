<template>
  <div class="detail-information">
    <div class="wrap">

      <div class="content-container">
        <div class="toggle-button">
          <h4>Detail Information</h4>
          <div class="sliding-switch sliding-switch-white">
            <label class="switch">
              <input
                type="checkbox"
                @click="isExpended = !isExpended" >
              <span class="slider round"/>
            </label>
          </div>
        </div>
        <div
          v-if="isExpended"
          class="expending-block">
          <ul>
            <li
              v-for="(key, value) in details"
              :key="key">
              <p class="name">{{ value.name }}</p>
              <p class="value">{{ value.value }}</p>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    details: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isExpended: false
    };
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import 'DetailInformation.scss';
</style>
