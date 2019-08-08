<template>
  <div>
    <div class="dapp-header">
      <submit-component :btn-text="'Save & Continue'" />
      <banner-component :banner-text="'Tell us about your DApp'" />
    </div>
    <div class="dapp-container mt-5">
      <about-your-dapp class="about-your-dapp w-50" />
      <div class="dapp-container-right">
        <strength-of-info class="strength-of-info ml-5" />
        <mew-support />
      </div>
    </div>
  </div>
</template>

<script>
import AboutYourDappContainer from './containers/AboutYourDappContainer';
import StrengthOfInfoComponent from './components/StrengthOfInfoComponent';
import BannerComponent from './components/BannerComponent';
import BannerSubmitComponent from './components/BannerSubmitComponent';
import MewSupportComponent from './components/MewSupportComponent';

export default {
  components: {
    'about-your-dapp': AboutYourDappContainer,
    'strength-of-info': StrengthOfInfoComponent,
    'banner-component': BannerComponent,
    'submit-component': BannerSubmitComponent,
    'mew-support': MewSupportComponent
  },
  data() {
    return {
      data: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DappSubmissionLayout.scss';
</style>
