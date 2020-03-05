<template>
  <div class="d-flex align-center">
    <img src="@/assets/images/Icons/mew-connect.svg" />
    <div class="mew-connect-text ml-1">
      <div>MEWconnect</div>
      <div>Connected...</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.mew-connect-text div {
  font-size: 11px;
  line-height: 13px;
  color: $emerald;
}
</style>
