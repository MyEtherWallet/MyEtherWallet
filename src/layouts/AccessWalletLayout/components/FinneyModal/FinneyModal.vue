<template>
  <b-modal
    ref="finneyModal"
    title="FINNEY Connect"
    hide-footer
    class="bootstrap-modal nopadding"
    centered
  >
    <div class="finney-modal-content">
      <div class="content-container">
        <div class="finney-img">
          <img :src="finneyImg" />
        </div>
        <div class="finney-text-container">
          <div class="scan-container">
            <p>
              To connect please scan the QR code from FinneyWallet app on your
              FINNEY device
            </p>
          </div>
          <div class="qr-container">
            <div class="large">
              <qrcode :value="qrcode" :options="{ size: 186 }" />
            </div>
            <div class="small">
              <qrcode :value="qrcode" :options="{ size: 125 }" />
            </div>
          </div>
          <div class="text-container">
            <a
              href="http://shop.sirinlabs.com?rfsn=2397639.54fdf&utm_source=refersion&utm_medium=affiliate&utm_campaign=2397639.54fdf"
              target="blank"
              rel="noopener noreferrer"
            >
              <span>
                Get your
              </span>
              <h3>
                FINNEY™
              </h3>
              <span>
                now
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { MewConnectWallet } from '@/wallets';
import { Toast } from '@/helpers';
import { mapGetters } from 'vuex';
import finneyImg from '@/assets/images/etc/finney.png';

export default {
  data() {
    return {
      qrcode: '',
      finneyImg: finneyImg
    };
  },
  computed: {
    ...mapGetters({
      web3: 'web3'
    })
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
