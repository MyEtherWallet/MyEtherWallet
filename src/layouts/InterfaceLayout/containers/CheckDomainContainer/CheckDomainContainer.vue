<template>
  <div class="register-domain-container">
    <back-button 
      :reset-view="resetView" 
      :options="backButtonOptions" />


    <reveal-your-bid />
    <domain-unavailable />
    <domain-available />

  </div>
</template>

<script>
import BackButton from '../../components/BackButton';
import DomainAvailable from './components/DomainAvailable';
import DomainUnavailable from './components/DomainUnavailable';
import RevealYourBid from './components/RevealYourBid';

export default {
  components: {
    'back-button': BackButton,
    'domain-available': DomainAvailable,
    'domain-unavailable': DomainUnavailable,
    'reveal-your-bid': RevealYourBid
  },
  props: {},
  data() {
    return {
      backButtonOptions: {
        titleText: this.$t('common.checkDomain')
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'CheckDomainContainer-desktop.scss';
@import 'CheckDomainContainer-tablet.scss';
@import 'CheckDomainContainer-mobile.scss';
</style>
