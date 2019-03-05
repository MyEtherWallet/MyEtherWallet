<template>
  <div class="home">
    <top-banner />
    <about />
    <social />
  </div>
</template>

<script>
import AboutContainer from '@/containers/AboutContainer';
import Social from './components/Social';
import TopBanner from './components/TopBanner';
import { mapGetters } from 'vuex';

export default {
  name: 'HomeContainer',
  components: {
    'top-banner': TopBanner,
    about: AboutContainer,
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
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeLayout.scss';
</style>
