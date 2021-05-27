<template>
  <div class="upload-step d-flex">
    <h4 class="title">{{ $t('dappsStaked.upload') }}</h4>
    <p class="subtitle">{{ $t('dappsStaked.upload-desc') }}</p>
    <i18n path="dappsStaked.do-not-have-eth2">
      <router-link
        slot="generate"
        class="generate"
        :to="{ path: '/generate-eth2-keystore' }"
        target="_blank"
      >
        {{ $t('dappsStaked.generate') }}
      </router-link>
    </i18n>
    <div class="upload-container d-flex">
      <div class="d-flex">
        <img class="mx-3" :src="printerIcon" alt="printer-icon" />
        <span class="filename">{{
          fileName ? fileName : $t('dappsStaked.upload')
        }}</span>
      </div>
      <label class="d-flex" for="keystore">{{
        $t('dappsStaked.choose-file')
      }}</label>
      <input id="keystore" type="file" @change="upload" />
    </div>
    <div v-if="hasError" class="error mt-2">
      {{ $t('dappsStaked.error-keystore') }}
    </div>
    <div v-if="address" class="address-container mt-3 pa-3 d-flex">
      <span class="title">{{ $t('dappsStaked.withdraw-title') }}</span>
      <span class="address mt-2">{{ address }}</span>
    </div>
    <v-row class="mx-0 top-pad">
      <v-col class="pl-4" cols="6">
        <mew-button
          :loading="false"
          :has-full-width="true"
          btn-size="xlarge"
          title="back"
          @click.native="back"
        />
      </v-col>
      <v-col class="pl-4" cols="6">
        <mew-button
          :disabled="address === ''"
          :loading="false"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('ens.register-domain')"
          @click.native="doNext"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import printerIcon from '@/assets/images/icons/staked-upload-icon.svg';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  props: {
    next: {
      type: Function,
      default: function () {}
    },
    back: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      amount: '',
      disabled: false,
      fileName: '',
      address: '',
      hasError: false,
      printerIcon: printerIcon
    };
  },
  methods: {
    upload(e) {
      const self = this;
      const reader = new FileReader();
      reader.onloadend = function (evt) {
        try {
          self.file = JSON.parse(evt.target.result);
          if (
            self.file.version === 4 &&
            self.file.pubkey &&
            self.file.pubkey.length === 96
          ) {
            self.address = self.file.pubkey;
            self.hasError = false;
          } else {
            self.hasError = true;
            self.address = '';
          }
          self.$emit('completed', !self.hasError, {
            key: 'address',
            value: self.address
          });
        } catch (e) {
          Toast(e, ERROR);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
      this.fileName = e.target.files[0].name;
    },
    doNext() {
      console.log('do next'); // todo remove dev item
      this.next();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Upload.scss';

.top-pad {
  padding-top: 40px;
}
</style>
