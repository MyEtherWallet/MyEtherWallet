<template>
  <b-modal
    ref="finneyModal"
    title="FINNEY Connect"
    hide-footer
    class="bootstrap-modal nopadding"
    centered
  >
    <div class="finney-desktop">
      <div class="modal-content-right">
        <p>
          To connect, scan the QR code from <b>FinneyWallet</b> app on your
          <b>FINNEY™ BLOCKCHAIN SMARTPHONE</b>
        </p>
        <qrcode
          :value="qrcode"
          :options="{ size: 186 }"
          class="qrcode-container"
        />
        <div class="text-container">
          <a
            href="http://shop.sirinlabs.com?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf"
            target="blank"
            rel="noopener noreferrer"
          >
            <p>
              Get your
            </p>
            <h3>
              FINNEY™
            </h3>
            <p>
              now
            </p>
          </a>
        </div>
      </div>
    </div>
    <div v-if="false" class="finney-mobile">
      mobile
    </div>
  </b-modal>
</template>

<script>
import { MewConnectWallet } from '@/wallets';
import { Toast } from '@/helpers';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      qrcode: ''
    };
  },
  computed: {
    ...mapState(['web3'])
  },
  mounted() {
    this.$refs.finneyModal.$on('show', () => {
      new MewConnectWallet(this.generateQr)
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
  methods: {
    generateQr(code) {
      this.qrcode = code;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FinneyModal.scss';
</style>
