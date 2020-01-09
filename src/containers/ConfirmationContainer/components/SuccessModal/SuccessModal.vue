<template>
  <b-modal
    ref="success"
    centered
    hide-footer
    hide-header
    class="bootstrap-modal no-padding"
    static
    lazy
  >
    <div class="modal-content-block">
      <img src="@/assets/images/modal/garlands.png" />
      <div class="d-block text-center">
        <i class="check-icon fa fa-check" aria-hidden="true" />
        <h2 class="title">
          {{ successTitle ? successTitle : $t('confirmation.success') }}
        </h2>
        <p>{{ message }}</p>
      </div>

      <div class="buttons">
        <standard-button
          v-show="txHashExlporrer"
          :options="buttonCheckEtherscan"
          :click-function="goToLink"
        />
        <standard-button :options="buttonOk" :click-function="hideModal" />
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
    txHashExlporrer: {
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
        title:  this.$t('sendTx.success.button-check-explorer', { explorrerName: this.explorrerName }),
        buttonStyle: 'green-border',
        fullWidth: true
      };
    },
    buttonOk() {
      return {
        title:
          this.linkMessage === '' ? this.$t('common.ok') : this.linkMessage,
        buttonStyle: 'green',
        fullWidth: true
      };
    },
    explorrerName() {
      return Misc.getService(this.network.type.blockExplorerTX);
    }
  },
  methods: {
    goToLink() {
      // eslint-disable-next-line
      window.open(this.txHashExlporrer, '_blank');
    },
    hideModal() {
      if (this.linkTo !== '/') {
        this.$router.push({ path: this.linkTo });
      } else if (
        this.linkTo === '/' &&
        this.successTitle === 'Congratulations'
      ) {
        this.$router.push({ path: '/' });
      }
      this.$refs.success.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SuccessModal';
</style>
