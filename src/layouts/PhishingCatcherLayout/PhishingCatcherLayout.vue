<template>
  <div class="phishing-catcher-contianer">
    <div class="catcher-text">
      <h4>{{ $t('phishing.redirected') }}!</h4>
      <div>
        <div class="code-container">
          <code>
            {{ url }}
          </code>
        </div>
        <p>
          {{ $t('phishing.site-flagged') }} <br />
          {{ $t('phishing.redirected-browser') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      url: ''
    };
  },
  computed: {
    ...mapState('main', ['linkQuery'])
  },
  mounted() {
    if (this.linkQuery.hasOwnProperty('url')) {
      this.url = this.linkQuery['url'];
    } else if (this.linkQuery.hasOwnProperty('phishing-address')) {
      this.url = this.linkQuery['phishing-address'];
    } else {
      this.url = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PhishingCatcherLayout.scss';
</style>
