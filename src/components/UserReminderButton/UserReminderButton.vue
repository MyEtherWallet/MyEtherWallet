<template>
  <div class="user-reminder-button" popup="Security">
    <div class="popup-box">{{ $t('header.security') }}</div>
    <div class="button-block">
      <img src="~@/assets/images/icons/acknowledge.png" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'UserReminderButton.scss';
</style>
