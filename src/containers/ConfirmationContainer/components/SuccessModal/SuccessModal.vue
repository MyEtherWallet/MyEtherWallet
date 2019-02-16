<template>
  <b-modal
    ref="success"
    centered
    hide-footer
    hide-header
    class="bootstrap-modal no-padding"
  >
    <div class="modal-content-block">
      <div class="d-block text-center">
        <i class="check-icon fa fa-check" aria-hidden="true" />
        <h2 class="title">{{ $t('confirmation.success') }}</h2>
        <p>{{ message }}</p>
      </div>

      <div class="buttons">
        <a href="https://etherscan.io/" target="_blank"
          ><standard-button :options="buttonCheckEtherscan"
        /></a>
        <standard-button :options="buttonOk" @click="hideModal" />
      </div>
    </div>
    <!-- .modal-content-block -->
  </b-modal>
</template>

<script>
import StandardButton from '@/components/Buttons/StandardButton';

export default {
  components: {
    'standard-button': StandardButton
  },
  props: {
    message: {
      type: String,
      default: ''
    },
    linkMessage: {
      type: String,
      default: ''
    },
    linkTo: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      buttonCheckEtherscan: {
        title: 'Check Status on Etherscan',
        buttonStyle: 'green-border',
        fullWidth: true
      },
      buttonOk: {
        title: this.linkMessage === '' ? 'Ok' : this.linkMessage,
        buttonStyle: 'green',
        fullWidth: true
      }
    };
  },
  mounted() {},
  methods: {
    hideModal() {
      if (this.linkTo !== '/') {
        this.$router.push({ path: this.linkTo });
      }
      this.$refs.success.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SuccessModal';
</style>
