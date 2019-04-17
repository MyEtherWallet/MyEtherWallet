<template>
  <div class="loading-sign">
    <div class="loading-container">
      <div class="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p v-if="loadingmessage1 != ''" class="loading-message1">
        {{ loadingmessage1 }}
      </p>
      <p v-if="loadingmessage2 != ''" class="loading-message2">
        {{ loadingmessage2 }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSign',
  components: {},
  props: {
    type: {
      type: String,
      default: ''
    },
    loadingmessage1: {
      type: String,
      default: ''
    },
    loadingmessage2: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'LoadingSign';
</style>
