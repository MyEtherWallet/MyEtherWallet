<template>
  <div>
    <b-modal
      ref="importPrivateKey"
      title="Private Key"
      hide-footer
      centered
      class="bootstrap-modal"
    >
      <div class="modal-contents">
        <div class="not-recommended">
          {{ $t('accessWallet.notARecommendedWay') }}
        </div>
        <div class="input-container">
          <label for="privateKeyInput">Your Private Key</label>
          <textarea name="privateKeyInput" @change="privateKey" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    privateKey(e) {
      this.$emit('privateKey', e.target.value);
    }
  }
};
</script>

<style scoped lang="scss">
@import 'ImportPrivateKeyModal.scss';
</style>
