<template>
  <b-modal
    ref="finneyModal"
    title="FINNEY Connect"
    hide-footer
    class="bootstrap-modal nopadding modal-finney"
    centered
  >
    <div class="content-container">
      <div class="finney-img">
        <img />
      </div>
      <div class="finney-text-container">
        <div class="qr-container">
          <qrcode :value="qrcode" :options="{ size: 200 }" />
        </div>
        <div>
          <span>
            Get your
          </span>
          <h3>
            FINNEY™
          </h3>
          <span>
            now
          </span>
        </div>
      </div>
    </div>
    <customer-support />
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import { MewConnectWallet } from '@/wallets';
import { Toast } from '@/helpers';
import { mapGetters } from 'vuex';

export default {
  components: {
    'customer-support': CustomerSupport
  },
  data() {
    return {
      qrcode: ''
    };
  },
  computed: {
    ...mapGetters({
      path: 'path',
      web3: 'web3'
    })
  },
  mounted() {
    this.$refs.finneyModal.$on('show', () => {
      new MewConnectWallet(this.codeDisplay)
        .then(wallet => {
          if (!this.web3.eth) this.$store.dispatch('setWeb3Instance');
          this.$store.dispatch('decryptWallet', [wallet]).then(() => {
            this.$router.push({
              path: 'interface'
            });
          });
        })
        .catch(e => {
          Toast.responseHandler(e, false);
        });
    });
  },
  method: {
    generateQr(code) {
      this.qrcode = code;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FinneyModal.scss';
</style>
