<template>
  <div class="home">
    <top-banner />
    <about /> <faqs /> <social /> <promo class="promo" />
  </div>
</template>

<script>
import AboutContainer from '@/containers/AboutContainer';
import FaqsContainer from '@/containers/FaqsContainer';
import Promo from './components/Promo';
import Social from './components/Social';
import TopBanner from './components/TopBanner';
import { mapGetters } from 'vuex';

export default {
  name: 'HomeContainer',
  components: {
    'top-banner': TopBanner,
    about: AboutContainer,
    faqs: FaqsContainer,
    social: Social,
    promo: Promo
  },
  data() {
    return {
      address: '',
      resolvedAddress: ''
    };
  },
  computed: {
    ...mapGetters({
      online: 'online'
    })
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeLayout.scss';
</style>
