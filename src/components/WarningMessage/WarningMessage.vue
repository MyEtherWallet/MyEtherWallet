<template>
  <div class="warning-message">
    <div class="left">⚠️</div>
    <div class="right">
      <p class="title">{{ this.$t('common.not-recommended.string') }}</p>
      <p class="message">
        {{ this.$tc('common.not-recommended.warning1', getString) }}
        {{ this.$tc('common.not-recommended.warning2') }}
      </p>
      <div class="link">
        > {{ $t('common.read') }}:
        <a
          href="https://kb.myetherwallet.com/posts/offline/using-mew-offline/"
          target="_blank"
          rel="noopener noreferrer"
          >{{ this.$t('common.article.using-mew-offline') }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    warningType: {
      type: String,
      default: 'access'
    }
  },
  data() {
    return {};
  },
  computed: {
    getString() {
      return this.warningType === 'access' ? 1 : 2;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WarningMessage.scss';
</style>
