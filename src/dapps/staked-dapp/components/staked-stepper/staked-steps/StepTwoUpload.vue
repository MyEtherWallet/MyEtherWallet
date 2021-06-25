<template>
  <!--
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
          :title="$t('common.back')"
          @click.native="back"
        />
      </v-col>
      <v-col class="pl-4" cols="6">
        <mew-button
          :disabled="address === ''"
          :loading="false"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('common.next')"
          @click.native="doNext"
        />
      </v-col>
    </v-row>
  </div>
  -->
  <div
    class="dapps--staked--stepper--steps--Generate-Eth2-Address mx-auto pb-15"
    style="max-width: 550px"
  >
    <div class="mew-heading-2 py-12 text-center">Upload your keystore file</div>
    <div>
      Please upload your Eth2 keystore file, so we can check its integrity. Your
      rewards will be withdrawable to this address.
    </div>

    <phrase-block
      class="d-block d-sm-flex align-center justify-space-between mt-9"
    >
      <div class="d-flex align-center">
        <img
          src="@/assets/images/icons/icon-keystore-file.svg"
          alt="Keystore file"
        />
        <div class="ml-2">
          <div class="mew-heading-4 textSecondary--text">
            Upload your keystore file
          </div>
        </div>
      </div>
      <mew-button
        class="my-2"
        btn-size="small"
        title="Browse..."
        btn-style="outline"
        :has-full-width="$vuetify.breakpoint.xs"
        @click.native="isOpenDownloadKeystore = true"
      />
    </phrase-block>
    <!-- 
    <message-block class="mt-4">
      <div class="mew-heading-3 mb-3">Your Eth2 Address</div>
      <div class="word-wrap--break-word">
        0x9B4A9C1Ac1cA0CbF0d16f79893494da1752539020x9B4A9C1Ac1cA0CbF0d16f79893494da1752539020x9B4A9C1Ac1cA0CbF0d16f79893494da1752539020x9B4A9C1Ac1cA0CbF0d16f79893494da175253902
      </div>
    </message-block> -->

    <mew-warning-sheet
      class="mt-4"
      :title="addressWarning.title"
      :description="addressWarning.description"
    />

    <div
      class="
        mt-10
        d-flex
        flex-column-reverse flex-md-row
        align-center
        justify-center
      "
    >
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Back"
        btn-style="outline"
      />
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Next: Review my stake"
      >
      </mew-button>
    </div>
  </div>
</template>

<script>
// import MessageBlock from '@/core/components/AppMessageBlock';
import PhraseBlock from '@/components/PhraseBlock';
import printerIcon from '@/assets/images/icons/staked-upload-icon.svg';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  components: { PhraseBlock },
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
      addressWarning: {
        title: 'Is this your Eth2 address?',
        description:
          'Please ensure that you are using correct Eth2 keystore file, and that your Eth2 address is correct before proceeding.'
      },
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

<style lang="scss" scoped></style>
