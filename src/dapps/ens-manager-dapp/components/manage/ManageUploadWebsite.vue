<template>
  <div class="full-width">
    <div
      v-if="settingIpfs"
      class="d-flex flex-column align-center justify-center"
    >
      <v-progress-circular indeterminate color="primary" />
      <span class="mew-heading-2 titlePrimary--text">{{
        $t('ens.ipfs-processing')
      }}</span>
      <span>{{ $t('ens.ipfs-processing-description') }}</span>
    </div>
    <div v-if="!settingIpfs" class="d-flex flex-column">
      <div class="d-flex justify-end">
        <input
          ref="zipInput"
          type="file"
          style="display: none"
          accept=".zip"
          @change="fileChange"
        />
        <mew-button
          btn-style="transparent"
          :title="$t('ens.upload-my-website')"
          @click.native="$refs.zipInput.click()"
        />
      </div>
      <mew-input
        v-model="ipfs"
        :label="$t('ens.content-hash')"
        :placeholder="$t('ens.enter-hash')"
        :error-messages="error"
        @input="setHash"
      />
    </div>
    <div v-if="!settingIpfs" class="d-flex align-center justify-center mt-3">
      <mew-button
        :disabled="!isValidIPFS"
        :title="$t('ens.set-hash')"
        btn-size="xlarge"
        @click.native="setIpfs(ipfs)"
      />
    </div>
  </div>
</template>

<script>
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import isIpfs from 'is-ipfs';

export default {
  props: {
    setIpfs: {
      default: function () {
        return {};
      },
      type: Function
    },
    settingIpfs: {
      default: false,
      type: Boolean
    },
    uploadFile: {
      default: function () {
        return {};
      },
      type: Function
    },
    uploadedHash: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      ipfs: '' || this.uploadedHash,
      error: ''
    };
  },
  computed: {
    isValidIPFS() {
      if (this.ipfs !== '') return isIpfs.multihash(this.ipfs);
      return true;
    }
  },
  watch: {
    uploadedHash(newVal) {
      this.ipfs = newVal;
    },
    ipfs(newVal) {
      if (!newVal) this.ipfs = '';
    }
  },
  methods: {
    fileChange(e) {
      const TYPES = [
        'application/zip',
        'application/x-zip',
        'application/octet-stream',
        'application/x-zip-compressed'
      ];
      const supportedFile = TYPES.find(item => {
        return (
          e.target.files[0].type === item ||
          e.target.files[0].name.includes('.zip')
        );
      });
      if (!supportedFile) {
        this.$refs.zipInput.value = '';
        Toast(this.$t('ens.warning.upload-zip'), {}, WARNING);
        return;
      }
      if (e.target.files[0].size < 500) {
        this.$refs.zipInput.value = '';
        Toast(this.$t('ens.warning.too-small'), {}, WARNING);
        return;
      }
      if (e.target.files[0].size > 50000000) {
        this.$refs.zipInput.value = '';
        Toast(this.$t('ens.warning.too-big'), {}, WARNING);
        return;
      }
      this.uploadFile(e.target.files[0]);
    },
    setHash(val) {
      if (val) {
        this.error = isIpfs.multihash(val)
          ? ''
          : this.$t('ens.error.empty-invalid-ipfs');
      } else {
        this.error = '';
      }
    }
  }
};
</script>
