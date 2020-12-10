<template>
  <div class="helpcenter-button">
    <div class="wrap">
      {{ $t('common.having-issues') }}
      <a
        href="https://howto.xinfin.org/XinFinWallet/features"
        target="_blank"
        rel="noopener noreferrer"
        >{{ $t('common.help-center') }}</a
      >
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
@import 'HelpCenterButton.scss';
</style>
