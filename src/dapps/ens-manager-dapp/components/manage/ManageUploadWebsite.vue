<template>
  <div class="full-width">
    <div
      v-if="settingIpfs"
      class="d-flex flex-column align-center justify-center"
    >
      <v-progress-circular indeterminate color="greenPrimary" />
      <span class="mew-heading-2 textDark--text">{{
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
        :disabled="!isValidIPFS || !ipfs"
        :title="$t('ens.set-hash')"
        btn-size="xlarge"
        @click.native="setIpfs(ipfs)"
      />
    </div>
  </div>
</template>

<script setup>
import isIpfs from 'is-ipfs';

import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';

import { useI18n } from 'vue-i18n-composable';
import { computed, ref, watch } from 'vue';

// injections
const { t } = useI18n();

// props
const props = defineProps({
  setIpfs: {
    default: () => {},
    type: Function
  },
  settingIpfs: {
    default: false,
    type: Boolean
  },
  uploadFile: {
    default: () => {},
    type: Function
  },
  uploadedHash: {
    default: '',
    type: String
  }
});

// data
const ipfs = ref('' || props.uploadedHash);
const error = ref('');
const zipInput = ref(null);

// computed
const isValidIPFS = computed(() => {
  if (ipfs.value !== '') return isIpfs.multihash(ipfs.value);
  return true;
});

// watch
watch(props.uploadedHash, val => {
  if (!val) ipfs.value = '';
});

watch(ipfs, val => {
  if (!val) ipfs.value = '';
});

// methods
const fileChange = e => {
  const TYPES = [
    'application/zip',
    'application/x-zip',
    'application/octet-stream',
    'application/x-zip-compressed'
  ];
  const supportedFile = TYPES.find(item => {
    return (
      e.target.files[0].type === item || e.target.files[0].name.includes('.zip')
    );
  });
  if (!supportedFile) {
    zipInput.value = '';
    Toast(t('ens.warning.upload-zip'), {}, WARNING);
    return;
  }
  if (e.target.files[0].size < 500) {
    zipInput.value = '';
    Toast(t('ens.warning.too-small'), {}, WARNING);
    return;
  }
  if (e.target.files[0].size > 50000000) {
    zipInput.value = '';
    Toast(t('ens.warning.too-big'), {}, WARNING);
    return;
  }
  props.uploadFile(e.target.files[0]);
};

const setHash = val => {
  if (val) {
    error.value = isIpfs.multihash(val)
      ? ''
      : t('ens.error.empty-invalid-ipfs');
  } else {
    error.value = '';
  }
};
</script>
