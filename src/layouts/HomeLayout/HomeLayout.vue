<template>
  <div class="home">
    <top-banner/>
    <about/>
    <faqs/>
    <news v-show="online"/>
    <social/>
    <promo class="promo" />
  </div>
</template>

<script>
import AboutContainer from '@/containers/AboutContainer';
import FaqsContainer from '@/containers/FaqsContainer';
import NewsContainer from '@/containers/NewsContainer';
import Promo from './components/Promo';
import Social from './components/Social';
import TopBanner from './components/TopBanner';

export default {
  name: 'HomeContainer',
  components: {
    'top-banner': TopBanner,
    about: AboutContainer,
    faqs: FaqsContainer,
    news: NewsContainer,
    social: Social,
    promo: Promo
  },
  data() {
    return {
      online: true,
      address: '',
      resolvedAddress: ''
    };
  },
  watch: {
    online(newVal) {
      this.online = newVal;
    }
  },
  mounted() {
    if (this.$store.state.online) {
      this.online = true;
    } else {
      this.online = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeLayout.scss';
</style>
