<template>
  <div class="modal-container">
    <b-modal
      ref="socialAcctModal"
      class="bootstrap-modal social-acct-modal"
      centered
      hide-footer
      title="Add a social account"
    >
      <div class="modal-contents">
        <b-form>
          <b-form-group>
            <label for="dappSocialAccount" class="select-label">
              <b-form-select
                id="dappSocialAccount"
                v-model="dappSocialAccount"
                :options="dappSocialAccounts"
              ></b-form-select>
            </label>
          </b-form-group>
          <b-form-group>
            <b-form-input
              v-validate="'url:require_protocol'"
              v-model="dappSocialLink"
              name="url"
              placeholder="URL link"
              type="url"
            ></b-form-input>
            <p v-if="errors.has('url')" class="error">
              {{ errors.first('url') }}
            </p>
          </b-form-group>
        </b-form>
        <button
          :class="[errors.has('url') ? 'disabled' : 'submit-btn']"
          @click="onSubmit"
        >
          Submit
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import github from '@/assets/images/icons/github.png';
import twitter from '@/assets/images/icons/twitter.jpg';
import facebook from '@/assets/images/icons/facebook.png';

export default {
  name: 'SocialAcctModal',
  data() {
    return {
      dappSocialAccounts: [
        { value: null, text: 'Please select' },
        {
          value: github,
          html: '<img src="@/assets/images/icons/github.png"/>  Github'
        },
        { value: facebook, text: 'Facebook' },
        { value: twitter, text: 'Twitter' }
      ],
      dappSocialAccount: null,
      dappSocialLink: ''
    };
  },
  methods: {
    onSubmit() {
      this.$emit('addSocialAccount', {
        src: this.dappSocialAccount,
        url: this.dappSocialLink
      });
      this.dappSocialAccount = null;
      this.dappSocialLink = '';
      this.$refs.socialAcctModal.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SocialAcctModal.scss';
</style>

<style lang="scss">
.modal-dialog {
  border-radius: 12px;
  font-family: 'Avenir Next';
  height: 261px;
  width: 350px;
}
.modal-header {
  background-color: #ffffff;

  h5 {
    color: #0b2840;
    font-size: 20px;
    font-weight: 600;
    padding: 0;
  }

  .close {
    color: #506175;
    font-size: 35px;
  }

  .close:not(:disabled):not(.disabled):hover,
  .close:not(:disabled):not(.disabled):focus {
    color: #96a8b6;
  }
}
</style>
