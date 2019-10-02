<template>
  <div>
    <div class="ad-image-container">
      <a :href="useUrl(url)" rel="noopener noreferrer" target="_blank">
        <img :src="useImage(image)" alt class="icon" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {},
  props: {
    image: {
      type: String,
      default: 'mewconnect.png'
    },
    url: {
      type: String,
      default: 'https://mewconnect.myetherwallet.com/#/'
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(['network', 'web3', 'online'])
  },
  watch: {},
  methods: {
    useImage(name) {
      if (name === '') name = 'mewconnect.jpeg';
      // eslint-disable-next-line security/detect-non-literal-require
      return require(`@/assets/images/ads/${name}`);
    },
    useUrl(url) {
      if (url === '') url = 'https://mewconnect.myetherwallet.com/#/';
      return url;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'staticAd.scss';
</style>
