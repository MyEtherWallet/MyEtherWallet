<template>
  <div>
    <p v-if="lackOfInfo" class="error">
      Please provide all the required information we need.
    </p>
    <b-container class="dapp-info-container mx-auto mt-5 pb-5 pl-5">
      <p class="summary-header pt-5">DApp Information</p>
      <b-row>
        <b-col>
          <div class="mt-5">
            <p class="summary-title mb-3">DApp name</p>
            <p class="summary-content">{{ form.dappName }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3 mb-3">Tags</p>
            <div
              v-for="(tag, idx) in form.tags"
              :key="tag + idx"
              class="summary-tag-content mr-2 mb-2"
            >
              {{ tag }}
            </div>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Mock user flow</p>
            <p class="summary-content">
              <img :src="form.mockFlow" class="summary-img" />
              {{ cleanUrl(form.mockFlow) }}
            </p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Contract address</p>
            <p class="summary-content">{{ form.contractAddress }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Description</p>
            <span class="summary-content">{{ form.description }}</span>
          </div>
        </b-col>
        <b-col>
          <div class="mt-5">
            <p class="summary-title mb-3">Category</p>
            <p class="summary-content">{{ form.category }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Launch in the U.S. market</p>
            <p class="summary-content">{{ form.usMarket }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">DApp icon</p>
            <p class="summary-content">
              <img :src="form.dappIcon" class="summary-img" />
              {{ cleanUrl(form.dappIcon) }}
            </p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Banner image</p>
            <p class="summary-content">
              <img :src="form.banner" class="summary-img" />
              {{ cleanUrl(form.banner) }}
            </p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">DApp website</p>
            <p class="summary-content">{{ form.dappWeb }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">DApp contract audit</p>
            <p class="summary-content">{{ form.contractAudit }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">DApp status</p>
            <p class="summary-content">{{ form.dappStatus }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="dapp-team-container mx-auto mt-5 mb-5 pb-5 pl-5">
      <p class="summary-header pt-5">Team & company information</p>
      <b-row>
        <b-col>
          <div class="mt-5">
            <p class="summary-title mb-3">Authors</p>
            <p class="summary-content">{{ form.authors }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3 mb-3">My full name</p>
            <p class="summary-content">{{ form.fullName }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">My email address</p>
            <p class="summary-content">{{ form.email }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Company website</p>
            <p class="summary-content">{{ form.companyWebsite }}</p>
          </div>
        </b-col>
        <b-col>
          <div class="mt-5">
            <p class="summary-title mb-3">Social media</p>
            <div
              v-for="(link, idx) in form.socialLinks"
              :key="link + idx"
              class="social-links mr-2"
            >
              <img :src="link.src" class="social-img" />
            </div>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Software License</p>
            <p class="summary-content">{{ form.license }}</p>
          </div>
          <div class="mt-5">
            <p class="summary-title mb-3">Additional notes</p>
            <p class="summary-content">{{ form.additionalNotes }}</p>
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
    }
  },
  methods: {
    cleanUrl(url) {
      return url.slice(5);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SummaryContainer.scss';
</style>
