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
          v-for="item in explorers"
          :key="item.link"
          :options="item.options"
          :click-function="item.onClick"
        />
        <standard-button
          v-show="network.type.name === 'ETH' && txHashExlporrer"
          :options="buttonCheckEthVm"
          :click-function="goToEthVm"
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
    ...mapState('main', ['network', 'wallet']),
    buttonCheckEtherscan() {
      return {
        // eslint-disable-next-line
        title: this.$t('sendTx.success.button-check-explorer', {
          explorrerName: this.explorrerName
        }),
        buttonStyle: 'green-border',
        fullWidth: true
      };
    },
    explorers() {
      if (!this.txHashExlporrer) {
        return [];
      }

      if (Array.isArray(this.network.type.blockExplorers)) {
        return this.network.type.blockExplorers.map(item =>
          this.explorerOptions(item.tx)
        );
      }

      return [this.explorerOptions(this.network.type.blockExplorerTX)];
    },
    buttonCheckEthVm() {
      return {
        // eslint-disable-next-line
        title: this.$t('sendTx.success.button-check-explorer', {
          explorrerName: this.$t('footer.ethvm')
        }),
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
    }
  },
  methods: {
    goToLink(link) {
      // eslint-disable-next-line
      window.open(link, '_blank');
    },
    goToEthVm() {
      const ethVmLink = this.txHashExlporrer.replace(
        'https://etherscan.io/tx/',
        'https://www.ethvm.com/tx/'
      );
      // eslint-disable-next-line
      window.open(ethVmLink, '_blank');
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
    },
    explorerOptions(txLinkTmpl) {
      const link = txLinkTmpl.replace('[[txHash]]', this.txHashExlporrer);
      return {
        link,
        options: {
          title: this.$t('sendTx.success.button-check-explorer', {
            explorrerName: Misc.getService(txLinkTmpl)
          }),
          buttonStyle: 'green-border',
          fullWidth: true
        },
        onClick: () => this.goToLink(link)
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SuccessModal';
</style>
