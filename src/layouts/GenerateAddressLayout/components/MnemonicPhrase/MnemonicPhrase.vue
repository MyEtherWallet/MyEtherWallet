<template>
  <div class="mnemonic-phrase-container d-flex mt-4">
    <div class="d-flex title-container">
      <span class="title mr-2"
        >{{ $t('dappsStaked.generate-address.mnemonic-title') }}
      </span>
      <i18n
        class="desc"
        path="dappsStaked.generate-address.mnemonic-desc"
        tag="span"
      >
        <span slot="learn-more">{{ $t('common.learn-more') }}</span>
      </i18n>
    </div>
    <div class="mnemonic-container mt-4">
      <div v-for="(word, idx) in mnemonic" :key="word + idx">
        <span class="number">{{ idx + 1 }}.</span
        ><span class="word ml-1">{{ word }}</span>
      </div>
    </div>
    <div class="button-container d-flex">
      <a
        :download="keystoreName"
        rel="noopener noreferrer"
        :class="[
          !keystoreJson ? 'disabled' : '',
          'large-round-button-green-border mt-5'
        ]"
        :href="keystoreJson"
        @click="downloadDone"
      >
        <span v-if="keystoreJson">{{
          $t('dappsStaked.generate-address.download')
        }}</span>
        <div v-if="!keystoreJson" class="generating">
          <i class="fa fa-spinner fa-lg fa-spin" />
          <p>{{ $t('dappsStaked.generate-address.message-wait') }}</p>
        </div>
      </a>
      <button
        :class="[
          !downloaded ? 'disabled' : '',
          'large-round-button-green-filled mt-3'
        ]"
        @click="onContinue"
      >
        {{ $t('common.continue') }}
        <img alt src="~@/assets/images/icons/right-arrow.png" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mnemonic: {
      type: Array,
      default: () => {
        return [];
      }
    },
    keystoreJson: {
      type: String,
      default: ''
    },
    keystoreName: {
      type: String,
      default: ''
    },
    generating: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      downloaded: false
    };
  },
  methods: {
    onContinue() {
      this.$emit('onContinue');
    },
    downloadDone() {
      this.downloaded = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MnemonicPhrase.scss';
</style>
