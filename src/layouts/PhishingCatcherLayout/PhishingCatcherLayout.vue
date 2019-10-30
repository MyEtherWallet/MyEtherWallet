<template>
  <div class="phishing-catcher-contianer">
    <div class="catcher-text">
      <h4>YOU HAVE BEEN REDIRECTED!</h4>
      <div>
        <div class="code-container">
          <code>
            {{ url }}
          </code>
        </div>
        <p>
          This site has been flagged for suspicious activity, <br />
          so we've redirected your browser. Stay safe out there!
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
    ...mapState(['linkQuery'])
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
