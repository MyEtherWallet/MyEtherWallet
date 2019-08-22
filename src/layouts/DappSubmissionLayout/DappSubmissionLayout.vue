<template>
  <div>
    <div class="dapp-header">
      <banner-submit-component
        :show-preview="$route.fullPath === '/dapp-submission/dapp-summary'"
        :show-back="$route.fullPath !== '/dapp-submission'"
        :btn-text="
          $route.fullPath.includes('/dapp-summary')
            ? 'Submit'
            : 'Save & Continue'
        "
        :next="next"
        :back="previous"
      />
      <banner-component :banner-text="bannerText" />
      <b-progress :value="bannerValue" class="dapp-progress-bar"></b-progress>
    </div>
    <form
      class="fake-form"
      ref="fakeform"
      action="https://formspree.io/jessicap@myetherwallet.com"
      method="POST"
    >
      <input v-model="form.dappName" type="text" name="dappName" />
      <input v-model="form.category" type="text" name="category" />
      <input v-model="form.tags" type="text" name="tags" />
      <input v-model="form.description" type="text" name="description" />
      <input v-model="form.usMarket" type="text" name="usMarket" />
      <input v-model="form.dappStatus" type="text" name="dappStatus" />
      <input v-model="form.mockFlow" type="text" name="mockFlow" />
      <input
        v-model="form.contractAddress"
        type="text"
        name="contractAddress"
      />
      <input v-model="form.dappIcon" type="text" name="dappIcon" />
      <input v-model="form.banner" type="text" name="banner" />
      <input v-model="form.dappWeb" type="text" name="dappWeb" />
      <input v-model="form.contractAudit" type="text" name="contractAudit" />
      <input v-model="form.authors" type="text" name="authors" />
      <input v-model="form.fullName" type="text" name="fullName" />
      <input v-model="form.email" type="text" name="email" />
      <input v-model="form.socialLinks" type="text" name="socialLinks" />
      <input v-model="form.companyWebsite" type="text" name="companyWebsite" />
      <input v-model="form.license" type="text" name="license" />
      <input
        v-model="form.additionalNotes"
        type="text"
        name="additionalNotes"
      />
    </form>
    <div class="dapp-container">
      <router-view
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
        :update-authors="updateAuthors"
        :update-full-name="updateFullName"
        :update-email="updateEmail"
        :update-social-links="updateSocialLinks"
        :update-company-website="updateCompanyWebsite"
        :update-license="updateLicense"
        :update-additional-notes="updateAdditionalNotes"
        :form="form"
      />
      <div
        v-if="$route.fullPath !== '/dapp-submission/dapp-summary'"
        class="dapp-container-right"
      >
        <strength-of-info
          :lack-of-info="strengthPercentage < 50 ? true : false"
          :strength-of-info="strengthPercentage"
          class="strength-of-info ml-5"
        />
        <mew-support />
      </div>
      <success-modal
        ref="successModal"
        :success-title="'Congratulations'"
        :message="
          'It takes about 3-5 business days to review your DApp. And an email will be sent to you if the the status update.'
        "
      />
      <error-modal ref="errorModal" />
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
import SummaryContainer from './containers/SummaryContainer';
// import axios from 'axios';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal';
import ErrorModal from '@/containers/ConfirmationContainer/components/ErrorModal';

export default {
  components: {
    'about-your-dapp': AboutYourDappContainer,
    'strength-of-info': StrengthOfInfoComponent,
    'banner-component': BannerComponent,
    'banner-submit-component': BannerSubmitComponent,
    'mew-support': MewSupportComponent,
    'about-your-team': AboutYourTeamContainer,
    'summary-container': SummaryContainer,
    'success-modal': SuccessModal,
    'error-modal': ErrorModal
  },
  data() {
    return {
      form: {
        dappName: '',
        tags: [],
        mockFlow: '',
        contractAddress: '',
        description: '',
        category: '',
        usMarket: '',
        dappIcon: '',
        banner: '',
        dappWeb: '',
        contractAudit: '',
        dappStatus: '',
        authors: '',
        fullName: '',
        email: '',
        companyWebsite: '',
        socialLinks: [],
        license: '',
        additionalNotes: ''
      },
      bannerValue: 33,
      strengthPercentage: 0,
      dappNameUpdated: false,
      dappCategoryUpdated: false,
      dappTagsUpdated: false,
      dappDescriptionUpdated: false,
      dappUsMarketUpdated: false,
      dappStatusUpdated: false,
      dappMockUserFlowUpdated: false,
      dappContractAddressUpdated: false,
      dappIconUpdated: false,
      dappBannerUpdated: false,
      dappAuthorUpdated: false,
      dappFullNameUpdated: false,
      dappEmailUpdated: false,
      dappSocialLinksUpdated: false,
      dappSoftwareLicenseUpdated: false
    };
  },
  computed: {
    bannerText() {
      if (this.$route.fullPath === '/dapp-submission/dapp-summary') {
        return 'Summary';
      } else if (this.$route.fullPath === '/dapp-submission/about-your-team') {
        return 'Tell us about your team & company';
      }
      return 'Tell us about your DApp';
    }
  },
  methods: {
    next() {
      switch (this.$route.fullPath) {
        case '/dapp-submission':
        case '/dapp-submission/about-your-dapp':
          this.bannerValue = 66;
          this.$router.push('/dapp-submission/about-your-team');
          break;
        case '/dapp-submission/about-your-team':
          this.bannerValue = 100;
          this.$router.push('/dapp-submission/dapp-summary');
          break;
        case '/dapp-submission/dapp-summary':
          this.submitForm();
          break;
        default:
          this.$router.push('/dapp-submission');
          break;
      }
    },
    previous() {
      this.bannerValue -= 33;
      this.$router.go(-1);
    },
    updateStrengthPercentage(formName, isFormUpdated, percentage) {
      if (formName != null && formName.length > 0 && !isFormUpdated) {
        this.addStrengthPercentage(percentage);
        isFormUpdated = true;
      } else if (
        (formName === null || formName === '' || formName.length === 0) &&
        isFormUpdated
      ) {
        this.removeStrengthPercentage(percentage);
        isFormUpdated = false;
      }
      return isFormUpdated;
    },
    addStrengthPercentage(num) {
      this.strengthPercentage += num;
    },
    removeStrengthPercentage(num) {
      if (this.strengthPercentage >= num) {
        this.strengthPercentage = this.strengthPercentage - num;
      } else {
        this.strengthPercentage = 0;
      }
      return this.strengthPercentage;
    },
    updateName(e) {
      this.form.dappName = e;
      this.dappNameUpdated = this.updateStrengthPercentage(
        this.form.dappName,
        this.dappNameUpdated,
        5
      );
    },
    updateCategory(e) {
      this.form.category = e;
      this.dappCategoryUpdated = this.updateStrengthPercentage(
        this.form.category,
        this.dappCategoryUpdated,
        5
      );
    },
    updateTags(e) {
      this.form.tags = e;
      this.dappTagsUpdated = this.updateStrengthPercentage(
        this.form.tags,
        this.dappTagsUpdated,
        5
      );
    },
    updateDescription(e) {
      this.form.description = e;
      this.dappDescriptionUpdated = this.updateStrengthPercentage(
        this.form.description,
        this.dappDescriptionUpdated,
        5
      );
    },
    updateUsMarket(e) {
      this.form.usMarket = e;
      this.dappUsMarketUpdated = this.updateStrengthPercentage(
        this.form.usMarket,
        this.dappUsMarketUpdated,
        5
      );
    },
    updateDappStatus(e) {
      this.form.dappStatus = e;
      this.dappStatusUpdated = this.updateStrengthPercentage(
        this.form.dappStatus,
        this.dappStatusUpdated,
        5
      );
    },
    updateMockFlow(e) {
      this.form.mockFlow = e;
      this.dappMockUserFlowUpdated = this.updateStrengthPercentage(
        this.form.mockFlow,
        this.dappMockUserFlowUpdated,
        5
      );
    },
    updateContractAddress(e) {
      this.form.contractAddress = e;
      this.dappContractAddressUpdated = this.updateStrengthPercentage(
        this.form.contractAddress,
        this.dappContractAddressUpdated,
        5
      );
    },
    updateDappIcon(e) {
      this.form.dappIcon = e;
      this.dappIconUpdated = this.updateStrengthPercentage(
        this.form.dappIcon,
        this.dappIconUpdated,
        10
      );
    },
    updateBanner(e) {
      this.form.banner = e;
      this.dappBannerUpdated = this.updateStrengthPercentage(
        this.form.banner,
        this.dappBannerUpdated,
        5
      );
    },
    updateDappWeb(e) {
      this.form.dappWeb = e;
    },
    updateContractAudit(e) {
      this.form.contractAudit = e;
    },
    updateAuthors(e) {
      this.form.authors = e;
      this.dappAuthorUpdated = this.updateStrengthPercentage(
        this.form.authors,
        this.dappAuthorUpdated,
        5
      );
    },
    updateFullName(e) {
      this.form.fullName = e;
      this.dappFullNameUpdated = this.updateStrengthPercentage(
        this.form.fullName,
        this.dappFullNameUpdated,
        5
      );
    },
    updateEmail(e) {
      this.form.email = e;
      this.dappEmailUpdated = this.updateStrengthPercentage(
        this.form.email,
        this.dappEmailUpdated,
        5
      );
    },
    updateSocialLinks(e) {
      this.form.socialLinks = e;
      this.dappSocialLinksUpdated = this.updateStrengthPercentage(
        this.form.socialLinks,
        this.dappSocialLinksUpdated,
        5
      );
    },
    updateCompanyWebsite(e) {
      this.form.companyWebsite = e;
    },
    updateLicense(e) {
      this.form.license = e;
      this.dappSoftwareLicenseUpdated = this.updateStrengthPercentage(
        this.form.license,
        this.dappSoftwareLicenseUpdated,
        5
      );
    },
    updateAdditionalNotes(e) {
      this.form.additionalNotes = e;
    },
    submitForm() {
      console.error('in here????');
      this.$refs.fakeform.submit();
      // axios({
      //   method: 'post',
      //   url: 'https://formspree.io/dapps@myetherwallet.com',
      //   data: {
      //     form: this.form
      //   }
      // }).then(res => {
      //   console.error('res', res)
      // })
      // .catch(err => {
      //   console.error('err', err)
      // })
      // this.$refs.successModal.$refs.success.show();
      // axios
      //   .post('https://formspree.io/dapps@myetherwallet.com', {
      //     form: this.form
      //   })
      //   .then(res => {
      //     this.$refs.successModal.$refs.success.show();
      //     // eslint-disable-next-line
      //     console.error('res', res);
      //   })
      //   .catch(err => {
      //     // change to toast
      //     this.$refs.errorModal.$refs.errorModal.show();
      //     // eslint-disable-next-line
      //     console.error('err', err);
      //   });
    }
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
