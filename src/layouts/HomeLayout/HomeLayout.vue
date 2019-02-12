<template>
  <div class="home">
    <top-banner />
    <about /> <faqs /> <social />
  </div>
</template>

<script>
import AboutContainer from '@/containers/AboutContainer';
import FaqsContainer from '@/containers/FaqsContainer';
import Social from './components/Social';
import TopBanner from './components/TopBanner';
import { mapGetters } from 'vuex';
// import { ErrorHandler } from '@/helpers';

export default {
  name: 'HomeContainer',
  components: {
    'top-banner': TopBanner,
    about: AboutContainer,
    faqs: FaqsContainer,
    social: Social
  },
  data() {
    return {
      address: '',
      resolvedAddress: '',
      message: 'pogchamp'
    };
  },
  computed: {
    ...mapGetters({
      online: 'online'
    })
  },
  mounted() {
    // ErrorHandler('bonk', 1, this); // warn
    // ErrorHandler('bruh', 2, this); // success
    // ErrorHandler('YEET', 3, this); // error
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeLayout.scss';
</style>
