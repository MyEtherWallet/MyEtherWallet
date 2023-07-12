<template>
  <div class="ad-form-component">
    <img
      src="@/assets/images/backgrounds/wave.png"
      width="100%"
      class="ad-img"
    />
    <div class="ad-form-container pb-15">
      <div class="text-center">
        <img
          src="@/assets/images/backgrounds/mew-spaceman.png"
          alt="mew spaceman"
          class="d-inline d-md-none ad-form-img"
        />
      </div>
      <div
        class="text-center mew-title font-weight-regular expandHeader--text title-anchor-ad-mew"
      >
        Are you ready to <br />
        advertise with us?
      </div>
      <div class="expandHeader--text d-flex justify-center mb-5">
        Send us a message and our team will contact you to <br />
        discuss options and answer any questions you have.
      </div>
      <div class="d-flex align-center justify-center ad-form-holder">
        <img
          src="@/assets/images/backgrounds/mew-spaceman.png"
          alt="mew spaceman"
          class="d-none d-md-inline"
        />
        <form class="ad-form">
          <v-text-field
            v-model="formInfo['name']"
            outlined
            placeholder="NAME"
            :rules="[requiredRule]"
          />
          <v-text-field
            v-model="formInfo['companyName']"
            outlined
            placeholder="COMPANY NAME"
            :rules="[requiredRule]"
          />
          <v-text-field
            v-model="formInfo['companyWebsite']"
            outlined
            placeholder="COMPANY WEBSITE"
          />
          <v-text-field
            v-model="formInfo['contactNumber']"
            outlined
            placeholder="CONTACT NUMBER"
            :rules="[requiredRule]"
          />
          <v-text-field
            v-model="formInfo['email']"
            outlined
            placeholder="EMAIL"
            :rules="[requiredRule, emailRule]"
          />
          <textarea
            v-model="formInfo['message']"
            placeholder="MESSAGE"
            class="mb-5"
          />
          <div class="d-flex align-center justify-center">
            <mew-button
              btn-style="background"
              color-theme="primary"
              btn-size="xlarge"
              title="SUBMIT"
              :disabled="!validForm"
              @click.native="submitForm"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import isEmail from '@/core/helpers/isEmail.js';
export default {
  data() {
    return {
      formInfo: {
        name: '',
        companyName: '',
        companyWebsite: '',
        contactNumber: '',
        email: '',
        message: ''
      }
    };
  },
  computed: {
    validForm() {
      return (
        this.formInfo['name'] !== '' &&
        this.formInfo['companyName'] !== '' &&
        this.formInfo['contactNumber'] !== '' &&
        this.formInfo['email'] !== '' &&
        isEmail(this.formInfo['email'])
      );
    }
  },
  methods: {
    requiredRule(value) {
      return !!value || 'Required';
    },
    emailRule(value) {
      return isEmail(value) || 'Invalid e-mail';
    },
    submitForm() {
      const form = new FormData();
      for (const key in this.formInfo) {
        form.append(key, this.formInfo[key]);
      }

      fetch('https://formspree.io/f/xbjenjql', {
        method: 'POST',
        body: form,
        headers: {
          Accept: 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            Toast(
              'Your information has been submitted. Thank you for reaching out, you will receive our response within several business days.',
              {},
              SUCCESS
            );
            this.clear();
          }
        })
        .catch(() => {
          Toast(
            'Something went wrong while submitting your information. Please try again later.',
            {},
            ERROR
          );
          this.clear();
        });
    },
    clear() {
      this.formInfo['name'] = '';
      this.formInfo['companyName'] = '';
      this.formInfo['companyWebsite'] = '';
      this.formInfo['contactNumber'] = '';
      this.formInfo['email'] = '';
      this.formInfo['message'] = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-form-container {
  background-color: #b9e5df;

  .ad-form-img {
    width: 100%;
    max-width: 250px;
  }
}
.ad-img {
  position: relative;
  bottom: -6px;
}

.ad-form-holder {
  position: relative;

  img {
    width: 350px;
    position: absolute;
    top: -8vw;
    right: 12vw;
    z-index: 2;

    @media screen and (max-width: 960px) {
      top: -8vw;
      right: 0;
    }
  }

  .ad-form {
    max-width: 500px;
    width: 100%;

    .v-input__slot,
    textarea {
      width: 100%;
      background: #fcfcfb;
      border-radius: 4px;
      border: 0.347165px solid #b6b6b6;
      padding: 14px;
    }

    textarea {
      min-height: 80px;
    }
  }
}
</style>

<style lang="scss">
.ad-form {
  .v-input__slot {
    width: 100%;
    background: #fcfcfb !important;
    border-radius: 4px;
    border: 0.347165px solid #b6b6b6;
    padding: 14px;
  }
}
</style>
