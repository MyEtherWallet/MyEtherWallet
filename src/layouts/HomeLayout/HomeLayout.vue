<template>
  <div class="home">
    <top-banner />
    <about />
    <faqs />
    <social />
  </div>
</template>

<script>
import AboutContainer from '@/containers/AboutContainer';
import FaqsContainer from '@/containers/FaqsContainer';
import Social from './components/Social';
import TopBanner from './components/TopBanner';
import { mapState } from 'vuex';
import mainStore from '@/store/main'
import registerStoreModule from '@/register-store-module';

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
      resolvedAddress: ''
    };
  },
  computed: {
    ...mapState('main', ['online'])
  },
  fetch({ store }) {
    // Dynamically register the store module
    // for our landing page data.
    registerStoreModule({ module: mainStore, name: 'main', store });

    // Do not load data again if already in store.
    if (store.state['main'].id) return;

    // Trigger the action for fetching all
    // the necessary data from the API.
    return store.dispatch('CHECK_IF_ONLINE');
  },
};
</script>

<style lang="scss" scoped>
@import 'HomeLayout.scss';
</style>
