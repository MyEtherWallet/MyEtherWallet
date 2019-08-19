<template>
  <div>
    <div class="dapp-header">
      <submit-component :btn-text="'Save & Continue'"/>
      <banner-component :banner-text="'Tell us about your DApp'" />
      <b-progress :value="25" class="dapp-progress-bar"></b-progress>
    </div>
    <div class="dapp-container">
      <!-- <about-your-dapp 
        class="about-your-dapp w-50 mb-5"
        :update-name="updateName"
        :update-category="updateCategory"
        :update-tags="updateTags"
        :update-description="updateDescription"
        :update-us-market="updateUsMarket"
        :update-dapp-status="updateDappStatus"
        :update-mock-flow="updateMockFlow"
        :update-contract-address="updateContractAddress"
        :update-dapp-icon="updateDappIcon"
        :update-banner="updateBanner"
        :update-dapp-web="updateDappWeb"
        :update-contract-audit="updateContractAudit"
      /> -->
      <about-your-team 
        class="about-your-dapp w-50 mb-5" 
      />
      <div class="dapp-container-right">
        <strength-of-info
          :lack-of-info="false"
          :strength-of-info="'12%'"
          class="strength-of-info ml-5"
        />
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
import AboutYourTeamContainer from './containers/AboutYourTeamContainer';

export default {
  components: {
    'about-your-dapp': AboutYourDappContainer,
    'strength-of-info': StrengthOfInfoComponent,
    'banner-component': BannerComponent,
    'submit-component': BannerSubmitComponent,
    'mew-support': MewSupportComponent,
    'about-your-team': AboutYourTeamContainer
  },
  data() {
    return {
      form: {
        tags: []
      }
    };
  },
  methods: {
    updateName(e) {
      this.form.dappName = e;
    },
    updateCategory(e) {
      this.form.category = e;
    },
    updateTags(e) {
      this.form.tags.push(e);
    },
    updateDescription(e) {
      this.form.description = e;
    },
    updateUsMarket(e) {
      this.form.usMarket = e;
    },
    updateDappStatus(e) {
      this.form.dappStatus = e;
    },
    updateMockFlow(e) {
      console.error('category', e)
      this.form.mockFlow = e;
    },
    updateContractAddress(e) {
      this.form.contractAddress = e;
    },
    updateDappIcon(e) {
      this.form.dappIcon = e;
    },
    updateBanner(e) {
      this.form.banner = e;
    },
    updateDappWeb(e) {
      this.form.dappWeb = e;
    },
    updateContractAudit(e) {
      this.form.contractAudit = e;
    },
  }
};
</script>

<style lang="scss" scoped>
@import 'DappSubmissionLayout.scss';
</style>

<style lang="scss">
.dapp-progress-bar {
  .progress-bar {
    background-color: #05c0a5;
  }
}
</style>
