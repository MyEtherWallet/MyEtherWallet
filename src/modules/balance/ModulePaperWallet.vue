<template>
  <mew-overlay
    :footer="footer"
    color-type="white"
    :show-overlay="isOverlayOpen"
    title="My paper wallet"
    content-size="xlarge"
    :close="close"
    @closeOverlay="close"
  >
    <!-- =============================================== -->
    <!-- Printable paper wallet content -->
    <!-- =============================================== -->
    <div ref="printContainer" class="printable-wallet printable-wallet-content">
      <paper-wallet-to-print v-if="instance" />
    </div>

    <!-- =============================================== -->
    <!-- Paper wallet to show -->
    <!-- =============================================== -->
    <paper-wallet-to-display v-if="instance" class="printable-wallet-display" />

    <div class="d-flex justify-center mt-12">
      <mew-button
        class="printButton"
        title="Print"
        btn-size="xlarge"
        @click.native="print"
      />
    </div>
  </mew-overlay>
</template>

<script>
export default {
  name: 'BalanceAddressPaperWallet',
  components: {
    PaperWalletToPrint: () => import('./components/PaperWalletToPrint'),
    PaperWalletToDisplay: () => import('./components/PaperWalletToDisplay')
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function () {
        return {};
      },
      type: Function
    },
    isOfflineApp: {
      default: false,
      type: Boolean
    },
    instance: {
      default: () => null,
      type: Object
    }
  },
  data() {
    return {
      footer: {
        text: 'Need help?',
        linkTitle: 'Contact support',
        link: 'mailto:support@myetherwallet.com'
      }
    };
  },
  computed: {
    isOverlayOpen() {
      return this.open;
    }
  },
  watch: {
    isOverlayOpen(val) {
      if (val === false) {
        this.$emit('close');
      }
    }
  },
  mounted() {
    if (this.isOfflineApp) {
      this.footer = {
        text: 'Need help? Email us at support@myetherwallet.com',
        linkTitle: '',
        link: ''
      };
    }
  },
  methods: {
    async print() {
      window.print();
    }
  }
};
</script>

<style lang="scss">
.printable-wallet {
  position: fixed;
  top: -3000px;
  left: -3000px;
  z-index: -1;
}
@media print {
  .printable-wallet-display {
    display: none;
  }
  .printable-wallet {
    background-color: rgb(241, 15, 15);
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
