<template>
  <div class="about-container mt-5">
    <b-form>
      <b-form-group>
        <label 
          class="dapp-label">Authors
          <popover
            class="dapp-popover"
            :popcontent="$t('dappsSubmission.authors')"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            id="authors"
            placeholder="e.g. James Lee; Emilie Roy; Edward McCormick"
            required
            type="text"
            @update="updateAuthors"
            v-model="authors">
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label
          class="dapp-label">My full name
          <popover
            class="dapp-popover"
            :popcontent="$t('dappsSubmission.fullName')"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input 
            v-model="fullName"
            id="fullName"
            type="text"
            required
            @update="updateFullName">
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label
          class="dapp-label">My email
          <popover
            class="dapp-popover"
            :popcontent="$t('dappsSubmission.email')"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input 
            v-model="emailAddress"
            id="emailAddress"
            type="text"
            required
            @update="updateEmail">
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <div class="social-links-container">
          <label class="dapp-label"> Company social links</label>
          <button
            @click="showSocialAcctModal"
            class="add-btn pull-right">Add +
          </button>
        </div>
      </b-form-group>
      <b-form-group>
        <label
          class="dapp-label">Company website
          <popover
            class="dapp-popover"
            :popcontent="$t('dappsSubmission.companyWebsite')"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            v-model="companyWebsite"
            id="companyWebsite"
            type="text"
            placeholder="URL link"
            required
            @update="updateCompanyWebsite">
          </b-form-input>
        </div>
      </b-form-group>
      <b-form-group>
        <label 
          class="dapp-label">Software license 
          <popover
            class="dapp-popover"
            :popcontent="$t('dappsSubmission.softwareLicense')"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input 
            v-model="softwareLicense"
            id="softwareLicense"
            type="text"
            placeholder="(e.g. MIT, GPL, Proprietary)"
            required
            @update="updateLicense">
          </b-form-input>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">Additional notes</label>
        <div class="dapp-input">
          <b-form-textarea
            v-model="additionalNotes"
            size="lg"
            rows="5"
            placeholder="300 characters"
            @update="updateAdditionalNotes"
          ></b-form-textarea>
        </div>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import PopOver from '@/components/PopOver';

export default {
  props: {
    updateAuthors: {
      type: Function,
      default: () => {}    
    },
    updateFullName: {
      type: Function,
      default: () => {}
    },
    updateEmail: {
      type: Function,
      default: () => {}
    },
    updateSocialLinks: {
      type: Function,
      default: () => {}
    },
    updateCompanyWebsite: {
      type: Function,
      default: () => {}
    },
    updateLicense: {
      type: Function,
      default: () => {}
    },
    updateAdditionalNotes: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    'popover': PopOver
  },
  data() {
    return {
      authors: '',
      fullName: '',
      emailAddress: '',
      companyWebsite: '',
      softwareLicense: '',
      additionalNotes: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AboutYourTeamContainer.scss';
@import '../AboutYourDappTeamContainer.scss';
</style>

<style lang="scss">
.dapp-label {
  align-items: center;
  display: flex;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>