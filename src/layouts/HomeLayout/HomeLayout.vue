<template>
  <div class="home">
    <top-banner />
    <about />
    <faqs />
    <social />
    <kyc-modal ref="kycModal" />
  </div>
</template>

<script>
import AboutContainer from '@/containers/AboutContainer';
import FaqsContainer from '@/containers/FaqsContainer';
import Social from './components/Social';
import KYCModal from './components/KYCModal';
import TopBanner from './components/TopBanner';
import { mapGetters } from 'vuex';
import store from 'store';

export default {
  name: 'HomeContainer',
  components: {
    'top-banner': TopBanner,
    about: AboutContainer,
    faqs: FaqsContainer,
    social: Social,
    'kyc-modal': KYCModal
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
    const x = store.get('x') || 0;
    if (x <= 5) {
      this.$refs.kycModal.$refs.kycModal.show();
      // if (new Date() >= 1554102000000 && new Date() < 1554188400000) {
      //   this.$refs.kycModal.$refs.kycModal.show();
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeLayout.scss';
</style>
