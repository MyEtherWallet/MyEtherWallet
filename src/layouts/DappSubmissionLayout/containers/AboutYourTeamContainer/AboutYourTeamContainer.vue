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
            v-validate="'required'"
            id="authors"
            v-model="form.authors"
            name="authors"
            placeholder="e.g. James Lee; Emilie Roy; Edward McCormick"
            type="text"
            @update="updateAuthors"
          >
          </b-form-input>
          <span>*</span>
        </div>
        <p v-if="errors.has('authors')" class="error">
          {{ errors.first('authors') }}
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">My full name </label>
        <div class="dapp-input">
          <b-form-input
            v-validate="'required'"
            id="fullName"
            v-model="form.fullName"
            name="name"
            type="text"
            @update="updateFullName"
          >
          </b-form-input>
          <span>*</span>
        </div>
        <p v-if="errors.has('name')" class="error">
          {{ errors.first('name') }}
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">My email </label>
        <div class="dapp-input">
          <b-form-input
            v-validate="'email|required'"
            id="emailAddress"
            v-model="form.email"
            name="email"
            type="text"
            @update="updateEmail"
            @change="updateDisableBtn(errors)"
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
          <div class="social-links-header-wrapper">
            <div class="social-links-header">
              <label class="dapp-social-label"> Company social links</label>
              <button class="add-btn pull-right" @click="openSocialAcctModal">
                Add +
              </button>
            </div>
            <span class="requiredIcon">*</span>
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
        <p v-if="socialLinksError" class="error">
          The company social links field is required
        </p>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">Company website </label>
        <div class="dapp-input">
          <b-form-input
            v-validate="'url:require_protocol'"
            id="companyWebsite"
            v-model="form.companyWebsite"
            type="text"
            name="website"
            placeholder="URL link"
            @change="updateDisableBtn(errors)"
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
            v-model="form.license"
            type="text"
            placeholder="(e.g. MIT, GPL, Proprietary)"
          >
          </b-form-input>
        </div>
      </b-form-group>
      <b-form-group>
        <label class="dapp-label">Additional notes</label>
        <div class="dapp-input">
          <b-form-textarea
            v-validate="'max:300'"
            v-model="form.additionalNotes"
            size="lg"
            rows="5"
            name="notes"
            placeholder="300 characters"
            @change="updateDisableBtn(errors)"
          ></b-form-textarea>
        </div>
        <p v-if="errors.has('notes')" class="error">
          {{ errors.first('notes') }}
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
    form: {
      type: Object,
      default: function() {
        return {};
      }
    },
    socialAccts: {
      type: Array,
      default: function() {
        return [];
      }
    },
    updateDisableBtn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      socialLinks: [],
      socialLinksError: false
    };
  },
  methods: {
    openSocialAcctModal() {
      this.$refs.socialacct.$refs.socialAcctModal.show();
      this.socialLinksError = this.socialLinks.length === 0;
    },
    addSocialAccount(account) {
      this.socialAccts.push(account);
      this.socialLinks.push(account.url);
      this.socialLinksError = this.socialLinks.length === 0;
      this.updateSocialLinks(this.socialLinks, this.socialAccts);
    },
    removeSocialLink(idx) {
      this.socialAccts.splice(idx, 1);
      this.socialLinks.splice(idx, 1);
      this.socialLinksError = this.socialLinks.length === 0;
      this.updateSocialLinks(this.socialLinks, this.socialAccts);
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
