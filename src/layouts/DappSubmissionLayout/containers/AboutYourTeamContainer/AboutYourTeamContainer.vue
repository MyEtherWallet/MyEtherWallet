<template>
  <div class="about-your-dapp w-50 mb-5 mt-5">
    <social-acct-modal ref="socialacct" @addSocialAccount="addSocialAccount" />
    <b-form onsubmit="return false;">
      <b-form-group>
        <label class="dapp-label"
          >Authors
          <popover
            :popcontent="$t('dappsSubmission.authors')"
            class="dapp-popover"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            id="authors"
            v-model="authors"
            placeholder="e.g. James Lee; Emilie Roy; Edward McCormick"
            type="text"
            @update="updateAuthors"
          >
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >My full name
          <popover
            :popcontent="$t('dappsSubmission.fullName')"
            class="dapp-popover"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            id="fullName"
            v-model="fullName"
            type="text"
            @update="updateFullName"
          >
          </b-form-input>
          <span>*</span>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >My email
          <popover
            :popcontent="$t('dappsSubmission.email')"
            class="dapp-popover"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            v-validate="'email'"
            id="emailAddress"
            v-model="emailAddress"
            name="email"
            type="text"
            @update="
              updateEmail(
                emailAddress,
                errors.has('email') && emailAddress !== ''
              )
            "
          >
          </b-form-input>
          <span>*</span>
        </div>
        <p v-if="errors.has('email')" class="error">
          {{ errors.first('email') }}
        </p>
      </b-form-group>
      <b-form-group>
        <div class="social-links-container">
          <div class="social-links-header">
            <label class="dapp-social-label"> Company social links</label>
            <button class="add-btn pull-right" @click="openSocialAcctModal">
              Add +
            </button>
          </div>
          <div v-if="socialAccts.length > 0" class="social-links-content">
            <div
              v-for="(acct, idx) in socialAccts"
              :idx="idx"
              :key="acct + idx"
              class="social-account"
            >
              <div class="fake-input mt-2">
                <img :src="acct.src" class="social-img" />
                <span class="social-url ml-1">{{ acct.url }}</span>
              </div>
              <img
                class="social-remove"
                src="@/assets/images/icons/remove.png"
                @click="removeSocialLink(idx)"
              />
            </div>
          </div>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >Company website
          <popover
            :popcontent="$t('dappsSubmission.companyWebsite')"
            class="dapp-popover"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            v-validate="'url:require_protocol'"
            id="companyWebsite"
            v-model="companyWebsite"
            type="text"
            name="website"
            placeholder="URL link"
            @update="
              updateCompanyWebsite(
                companyWebsite,
                errors.has('website') && companyWebsite !== ''
              )
            "
          >
          </b-form-input>
        </div>
        <p v-if="errors.has('website')" class="error">
          {{ errors.first('website') }}
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label"
          >Software license
          <popover
            :popcontent="$t('dappsSubmission.softwareLicense')"
            class="dapp-popover"
          ></popover>
        </label>
        <div class="dapp-input">
          <b-form-input
            id="softwareLicense"
            v-model="softwareLicense"
            type="text"
            placeholder="(e.g. MIT, GPL, Proprietary)"
            @update="updateLicense"
          >
          </b-form-input>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">Additional notes</label>
        <div class="dapp-input">
          <b-form-textarea
            v-validate="'max:300'"
            v-model="additionalNotes"
            size="lg"
            rows="5"
            name="additional notes"
            placeholder="300 characters"
            @update="
              updateAdditionalNotes(
                additionalNotes,
                errors.has('additional notes') && additionalNotes !== ''
              )
            "
          ></b-form-textarea>
        </div>
        <p v-if="errors.has('additional notes')" class="error">
          {{ errors.first('additional notes') }}
        </p>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import PopOver from '@/components/PopOver';
import SocialAcctModal from '../../components/SocialAcctModal';

export default {
  components: {
    popover: PopOver,
    'social-acct-modal': SocialAcctModal
  },
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
  data() {
    return {
      authors: '',
      fullName: '',
      emailAddress: '',
      companyWebsite: '',
      softwareLicense: '',
      additionalNotes: '',
      socialAccts: []
    };
  },
  methods: {
    openSocialAcctModal() {
      this.$refs.socialacct.$refs.socialAcctModal.show();
    },
    addSocialAccount(account) {
      this.socialAccts.push(account);
      this.updateSocialLinks(this.socialAccts);
    },
    removeSocialLink(idx) {
      this.socialAccts.splice(idx, 1);
      this.updateSocialLinks(this.socialAccts);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AboutYourTeamContainer.scss';
@import '../AboutYourDappTeamContainer.scss';
</style>

<style lang="scss">
.dapp-social-label {
  align-items: center;
  display: flex;
  font-size: 16px;
  margin-bottom: 10px;
  width: auto;
}
</style>
