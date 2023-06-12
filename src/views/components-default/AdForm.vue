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
          <input
            v-model="formInfo['name']"
            placeholder="NAME"
            class="mb-5"
            required
          />
          <input
            v-model="formInfo['companyName']"
            placeholder="COMPANY NAME"
            class="mb-5"
            required
          />
          <input
            v-model="formInfo['companyWebsite']"
            placeholder="COMPANY WEBSITE"
            class="mb-5"
          />
          <input
            v-model="formInfo['contactNumber']"
            placeholder="CONTACT NUMBER"
            class="mb-5"
            required
          />
          <input
            v-model="formInfo['email']"
            placeholder="EMAIL"
            class="mb-5"
            required
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
import normalise from '@/core/helpers/normalise';
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
        this.isEmail(this.formInfo['email'])
      );
    }
  },
  methods: {
    isEmail(input) {
      if (!input || input === '') return false;
      const atIndex = input.indexOf('@');
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      try {
        const parsedEmailName = normalise(input.substr(0, atIndex));
        const parsedEmailHost = normalise(
          input.substr(atIndex + 1, input.length)
        );
        return emailRegex.test(
          `${parsedEmailName}@${parsedEmailHost}`.toLowerCase()
        );
      } catch (e) {
        return emailRegex.test(input);
      }
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

    @media screen and (max-width: 960px) {
      top: -8vw;
      right: 0;
    }
  }

  .ad-form {
    max-width: 500px;
    width: 100%;

    input,
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
