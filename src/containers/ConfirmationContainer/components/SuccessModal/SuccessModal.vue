<template>
  <b-modal
    ref="success"
    centered
    hide-footer
    hide-header
    class="bootstrap-modal no-padding"
  >
    <div class="modal-content-block">
      <img src="@/assets/images/modal/garlands.png" />
      <div class="d-block text-center">
        <i class="check-icon fa fa-check" aria-hidden="true" />
        <h2 class="title">{{ successTitle ? successTitle : $t('confirmation.success') }}</h2>
        <p>{{ message }}</p>
      </div>

      <div class="buttons">
        <a
          v-if="etherscanLink"
          :href="etherscanLink"
          target="_blank"
          rel="noopener noreferrer"
        >
          <standard-button :options="buttonCheckEtherscan" />
        </a>
        <standard-button :options="buttonOk" @click.native="hideModal" />
      </div>
    </div>
    <!-- .modal-content-block -->
  </b-modal>
</template>

<script>
import StandardButton from '@/components/Buttons/StandardButton';
import { mapState } from 'vuex';
import { Misc } from '@/helpers';

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
    },
    etherscanLink: {
      type: String,
      default: null
    },
    successTitle: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapState(['network']),
    buttonCheckEtherscan() {
      return {
        // eslint-disable-next-line
        title: `Check Status on ${this.explorrerName}`,
        buttonStyle: 'green-border',
        fullWidth: true
      };
    },
    buttonOk() {
      return {
        title: this.linkMessage === '' ? 'Ok' : this.linkMessage,
        buttonStyle: 'green',
        fullWidth: true
      };
    },
    explorrerName() {
      return Misc.getService(this.network.type.blockExplorerTX);
    }
  },
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
