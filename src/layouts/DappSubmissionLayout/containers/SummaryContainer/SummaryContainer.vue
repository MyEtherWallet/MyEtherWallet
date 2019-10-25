<template functional>
  <div class="mt-5 ">
    <p v-if="props.lackOfInfo" class="error">
      {{ props.updateTranslations('provide-text') }}
    </p>
    <b-container class="dapp-info-container mx-auto mt-2 pb-5 pl-5 w-75">
      <p class="summary-header pt-5">
        {{ props.updateTranslations('dapp-info') }}
      </p>
      <b-row>
        <b-col>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.name') }}
            </p>
            <p class="summary-content">{{ props.form.dappName }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3 mb-3">
              {{ props.updateTranslations('about-your-dapp.tags-title') }}
            </p>
            <div
              v-for="(tag, idx) in props.form.tags"
              :key="tag + idx"
              class="summary-tag-content mr-2 mb-2"
            >
              {{ tag }}
            </div>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.mock-flow-title') }}
            </p>
            <p class="summary-content">
              <img
                v-if="props.form.mockFlowFile.type !== 'application/pdf'"
                :src="props.form.mockFlowUrl"
                class="summary-img"
              />
              <span class="align-middle">
                {{ props.form.mockFlowFile.name }}
              </span>
            </p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{
                props.updateTranslations(
                  'about-your-dapp.contract-address-title'
                )
              }}
            </p>
            <p class="summary-content">{{ props.form.contractAddress }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.description') }}
            </p>
            <span class="summary-content">{{ props.form.description }}</span>
          </div>
        </b-col>
        <b-col class="pl-5">
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.category') }}
            </p>
            <p class="summary-content">{{ props.form.category }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.launch-us') }}
            </p>
            <p class="summary-content">{{ props.form.usMarket }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.dapp-icon-title') }}
            </p>
            <p class="summary-content">
              <img :src="props.form.dappIconUrl" class="summary-img" />
              <span class="align-middle">
                {{ props.form.dappIconFile.name }}
              </span>
            </p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.banner-img') }}
            </p>
            <p class="summary-content">
              <img :src="props.form.bannerUrl" class="summary-img" />
              <span class="align-middle">
                {{ props.form.bannerFile.name }}
              </span>
            </p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.dapp-website') }}
            </p>
            <p class="summary-content">{{ props.form.dappWebsite }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{
                props.updateTranslations('about-your-dapp.contract-audit-title')
              }}
            </p>
            <p class="summary-content">{{ props.form.contractAudit }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-dapp.dapp-status') }}
            </p>
            <p class="summary-content">{{ props.form.dappStatus }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="dapp-team-container mx-auto mt-5 mb-5 pb-5 pl-5 w-75">
      <p class="summary-header pt-5">
        {{ props.updateTranslations('team-title') }}
      </p>
      <b-row>
        <b-col>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-team.authors-title') }}
            </p>
            <p class="summary-content">{{ props.form.authors }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3 mb-3">
              {{ props.updateTranslations('about-your-team.full-name') }}
            </p>
            <p class="summary-content">{{ props.form.fullName }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-team.email-address') }}
            </p>
            <p class="summary-content">{{ props.form.email }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-team.company-website') }}
            </p>
            <p class="summary-content">{{ props.form.companyWebsite }}</p>
          </div>
        </b-col>
        <b-col class="pl-5">
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('social-media') }}
            </p>
            <div
              v-for="(acct, idx) in props.socialAccts"
              :key="acct + idx"
              class="social-links mr-2"
            >
              <img :src="acct.src" class="social-img" />
            </div>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-team.license') }}
            </p>
            <p class="summary-content">{{ props.form.license }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">
              {{ props.updateTranslations('about-your-team.additional-notes') }}
            </p>
            <p class="summary-content">{{ props.form.additionalNotes }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: function() {
        return {};
      }
    },
    lackOfInfo: {
      type: Boolean,
      default: false
    },
    socialAccts: {
      type: Array,
      default: function() {
        return [];
      }
    },
    updateTranslations: {
      type: Function,
      default: function() {
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SummaryContainer.scss';
</style>
