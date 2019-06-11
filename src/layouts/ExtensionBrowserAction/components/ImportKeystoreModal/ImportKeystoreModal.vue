<template>
  <div>
    <b-modal
      ref="importKeystore"
      hide-footer
      centered
      class="bootstrap-modal"
      title="Keystore File (UTC/JSON)"
    >
      <form>
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
                :src="show ? showIcon : hide"
                @click.prevent="switchViewPassword"
              />
            </div>
          </div>
          <button
            :class="[
              inputsValid ? '' : 'disabled',
              'submit-button large-round-button-green-filled'
            ]"
            type="submit"
            @click.prevent="unlockJson"
          >
            <span v-show="!loading"> Add Wallet </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
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
      locPassword: this.password,
      showIcon: showIcon,
      hide: hide
    };
  },
  computed: {
    inputsValid() {
      return this.locPassword !== '' && this.filePath !== '';
    }
  },
  watch: {
    locPassword(newVal) {
      this.$emit('password', newVal);
    }
  },
  methods: {
    uploadFile(e) {
      const _self = this;
      const reader = new FileReader();
      reader.onloadend = function(evt) {
        try {
          _self.$emit('file', JSON.parse(evt.target.result));
          _self.file = JSON.parse(evt.target.result);
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
