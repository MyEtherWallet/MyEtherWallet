<template>
  <div>
    <b-modal
      ref="importKeystore"
      hide-footer
      centered
      class="bootstrap-modal"
      title="Keystore File (UTC/JSON)"
    >
      <div class="modal-contents">
        <div class="not-recommended">
          {{ $t('accessWallet.notARecommendedWay') }}
        </div>
        <div class="input-container">
          <label for="filePath"> Your Wallet File </label>
          <div class="keystore-filepath-input">
            <input
              v-model="filepath"
              name="filePath"
              type="text"
              class="disabled"
            />
            <input
              ref="uploadInput"
              type="file"
              class="hidden"
              @change="uploadFile"
            />
            <div class="mid-round-button-green-border" @click="clickUpload">
              Upload File...
            </div>
          </div>
        </div>
        <div class="input-container">
          <label for="keystorePassword"> Password </label>
          <div class="keystore-password-input">
            <input
              v-model="locPassword"
              :type="show ? 'text' : 'password'"
              placeholder="Enter your password"
              name="keystorePassword"
            />
            <img
              :src="
                show
                  ? '@/assets/images/icons/show-password.svg'
                  : '@/assets/images/icons/hide-password.svg'
              "
              @click.prevent="switchViewPassword"
            />
          </div>
        </div>
        <div
          :class="[
            true ? '' : 'disabled',
            'submit-button large-round-button-green-filled'
          ]"
          @click="unlockJson"
        >
          <span v-show="!loading"> Add Wallet </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    filepath: {
      type: String,
      default: ''
    },
    unlockJson: {
      type: Function,
      default: () => {}
    },
    password: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      locPassword: this.password
    };
  },
  watch: {
    locPassword(newVal) {
      this.$emit('password', newVal);
    }
  },
  methods: {
    uploadFile(e) {
      const self = this;
      const reader = new FileReader();
      reader.onloadend = function(evt) {
        try {
          self.$emit('file', JSON.parse(evt.target.result));
          self.file = JSON.parse(evt.target.result);
        } catch (e) {
          Toast.responseHandler(e, Toast.ERROR);
        }
      };
      this.$emit('filepath', e.target.value);
      reader.readAsBinaryString(e.target.files[0]);
    },
    clickUpload() {
      const input = this.$refs.uploadInput;
      input.value = '';
      input.click();
    },
    switchViewPassword() {
      this.show = !this.show;
    }
  }
};
</script>

<style scoped lang="scss">
@import 'ImportKeystoreModal.scss';
</style>
