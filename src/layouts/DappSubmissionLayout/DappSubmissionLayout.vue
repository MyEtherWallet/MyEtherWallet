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
        :disable-submit="isDisabledBtn()"
        :lack-of-info="strengthPercentage < 50 ? true : false"
      />
      <banner-component :banner-text="bannerText" />
      <b-progress :value="bannerValue" class="dapp-progress-bar"></b-progress>
    </div>
    <div class="dapp-container">
      <sotd />
      <router-view
        :update-name="updateName"
        :update-category="updateCategory"
        :update-tags="updateTags"
        :update-description="updateDescription"
        :update-disable-btn="updateDisableBtn"
        :update-us-market="updateUsMarket"
        :update-dapp-status="updateDappStatus"
        :update-mock-flow="updateMockFlow"
        :update-contract-address="updateContractAddress"
        :update-dapp-icon="updateDappIcon"
        :update-banner="updateBanner"
        :update-authors="updateAuthors"
        :update-full-name="updateFullName"
        :update-email="updateEmail"
        :update-social-links="updateSocialLinks"
        :form="form"
        :lack-of-info="strengthPercentage < 50 ? true : false"
        :social-accts="socialAccts"
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
          'It takes about 3-5 business days to review your Dapp. And an email will be sent to you if the the status update.'
        "
      />
    </div>
  </div>
</template>

<script>
import AboutYourDappContainer from './containers/AboutYourDappContainer';
import StrengthOfInfoComponent from './components/StrengthOfInfoComponent';
import BannerComponent from './components/BannerComponent';
import SOTDComponent from './components/SOTDComponent';
import BannerSubmitComponent from './components/BannerSubmitComponent';
import MewSupportComponent from './components/MewSupportComponent';
import AboutYourTeamContainer from './containers/AboutYourTeamContainer';
import SummaryContainer from './containers/SummaryContainer';
import axios from 'axios';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal';
import { Toast } from '@/helpers';
import FormData from 'form-data';

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
    'sotd': SOTDComponent
  },
  data() {
    return {
      form: {
        dappName: '',
        tags: [],
        mockFlowFile: '',
        mockFlowUrl: '',
        contractAddress: '',
        description: '',
        category: null,
        usMarket: null,
        dappIconFile: '',
        dappIconUrl: '',
        bannerFile: '',
        bannerUrl: '',
        dappWebsite: '',
        contractAudit: null,
        dappStatus: null,
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
      disableBtn: false,
      socialAccts: [],
      imgHasError: false
    };
  },
  computed: {
    bannerText() {
      if (this.$route.fullPath === '/dapp-submission/dapp-summary') {
        return 'Summary';
      } else if (this.$route.fullPath === '/dapp-submission/about-your-team') {
        return 'Tell us about your team & company';
      }
      return 'Tell us about your Dapp';
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
    updateName() {
      this.dappNameUpdated = this.updateStrengthPercentage(
        this.form.dappName,
        this.dappNameUpdated,
        10
      );
    },
    updateCategory() {
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
    updateDescription() {
      this.dappDescriptionUpdated = this.updateStrengthPercentage(
        this.form.description,
        this.dappDescriptionUpdated,
        10
      );
    },
    isDisabledBtn() {
      if (this.$route.fullPath === '/dapp-submission') {
        return !(
          this.form.dappName &&
          this.form.category &&
          this.form.tags.length > 0 &&
          this.form.description &&
          this.form.usMarket &&
          this.form.dappStatus &&
          this.form.mockFlowFile &&
          this.form.contractAddress &&
          this.form.dappIconFile &&
          this.form.bannerFile &&
          !this.imgHasError &&
          !this.disableBtn
        );
      } else if (this.$route.fullPath === '/dapp-submission/about-your-team') {
        return !(
          this.form.authors &&
          this.form.fullName &&
          this.form.email &&
          this.form.socialLinks.length > 0 &&
          !this.disableBtn
        );
      }
    },
    updateDisableBtn(errors) {
      if (errors && errors.items.length > 0) {
        this.disableBtn = true;
      } else {
        this.disableBtn = false;
      }
    },
    updateUsMarket() {
      this.dappUsMarketUpdated = this.updateStrengthPercentage(
        this.form.usMarket,
        this.dappUsMarketUpdated,
        5
      );
    },
    updateDappStatus() {
      this.dappStatusUpdated = this.updateStrengthPercentage(
        this.form.dappStatus,
        this.dappStatusUpdated,
        5
      );
    },
    updateMockFlow(hasError) {
      this.imgHasError = hasError;

      this.dappMockUserFlowUpdated = this.updateStrengthPercentage(
        this.form.mockFlowUrl,
        this.dappMockUserFlowUpdated,
        5
      );
    },
    updateContractAddress() {
      this.dappContractAddressUpdated = this.updateStrengthPercentage(
        this.form.contractAddress,
        this.dappContractAddressUpdated,
        10
      );
    },
    updateDappIcon(hasError) {
      this.imgHasError = hasError;

      this.dappIconUpdated = this.updateStrengthPercentage(
        this.form.dappIconUrl,
        this.dappIconUpdated,
        10
      );
    },
    updateBanner(hasError) {
      this.imgHasError = hasError;

      this.dappBannerUpdated = this.updateStrengthPercentage(
        this.form.bannerUrl,
        this.dappBannerUpdated,
        5
      );
    },
    updateAuthors() {
      this.dappAuthorUpdated = this.updateStrengthPercentage(
        this.form.authors,
        this.dappAuthorUpdated,
        5
      );
    },
    updateFullName() {
      this.dappFullNameUpdated = this.updateStrengthPercentage(
        this.form.fullName,
        this.dappFullNameUpdated,
        10
      );
    },
    updateEmail() {
      this.dappEmailUpdated = this.updateStrengthPercentage(
        this.form.email,
        this.dappEmailUpdated,
        5
      );
    },
    updateSocialLinks(socialLinks, socialAccts) {
      this.form.socialLinks = socialLinks;
      this.socialAccts = socialAccts;
      this.dappSocialLinksUpdated = this.updateStrengthPercentage(
        this.form.socialLinks,
        this.dappSocialLinksUpdated,
        10
      );
    },
    submitForm() {
      const formData = new FormData();
      this.form._cc = 'support@stateofthedapps.com';

      for (const key in this.form) {
        if (
          key !== 'bannerUrl' &&
          key !== 'dappIconUrl' &&
          key !== 'mockFlowUrl'
        )
          [formData.append(key, this.form[key])];
      }

      axios
        .post('https://formspree.io/mqjndkkx', formData, {
          header: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(this.$refs.successModal.$refs.success.show)
        .catch(function() {
          Toast.responseHandler(
            new Error('There is an error. Please try again'),
            Toast.ERROR
          );
        });
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
