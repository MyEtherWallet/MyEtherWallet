<template>
  <div class="upload-step d-flex">
    <div class="upload-container d-flex">
      <div class="d-flex">
        <span v-if="!file">
          <img class="mx-3" :src="printerIcon" alt="printer-icon" />
          {{ $t('dappsStaked.upload') }}
        </span>
        <span v-if="file" class="file">{{ file }}</span>
      </div>
      <label class="d-flex" for="keystore">{{
        $t('dappsStaked.choose-file')
      }}</label>
      <input id="keystore" type="file" @change="upload" />
    </div>
    <div v-if="address" class="address-container mt-3 pa-3 d-flex">
      <span class="title">{{ $t('dappsStaked.withdraw-title') }}</span>
      <span class="address mt-2">{{ address }}</span>
    </div>
  </div>
</template>

<script>
import printerIcon from '@/assets/images/icons/dapps/staked-upload-icon.svg';

export default {
  data() {
    return {
      amount: '',
      disabled: false,
      file: '',
      address:
        '8c5942ab6420644d681ce7b70df0f95737a9db493cfa4da52c08a398554aab19ccde4467d8e2dbec8c972725b0063130',
      printerIcon: printerIcon
    };
  },
  methods: {
    upload(file) {
      this.$emit('completed', { key: 'address', value: this.address });
      console.log('file', file);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Upload.scss';
</style>
