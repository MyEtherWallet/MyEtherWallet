<template>
  <b-modal
    ref="finneyModal"
    :title="$t('accessWallet.finney.finney-connect')"
    hide-footer
    class="bootstrap-modal nopadding"
    centered
    static
    lazy
  >
    <div class="finney-desktop">
      <div class="modal-content-right">
        <i18n path="accessWallet.finney.scan-info" tag="p">
          <b slot="wallet">{{ $t('accessWallet.finney.finney-wallet') }}</b>
          <b slot="finney-bc">{{ $t('accessWallet.finney.finney-bc') }}</b>
        </i18n>
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
            <i18n path="accessWallet.finney.get-finney" tag="p">
              <h3 slot="finney-title">
                {{ $t('accessWallet.finney.finney-title') }}
              </h3>
            </i18n>
          </a>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { MewConnectWallet } from '@/wallets';
import { Toast } from '@/helpers';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      qrcode: ''
    };
  },
  computed: {
    ...mapState('main', ['web3'])
  },
  mounted() {
    this.$refs.finneyModal.$on('show', () => {
      new MewConnectWallet(this.generateQr)
        .then(wallet => {
          if (!this.web3.eth) this.setWeb3Instance();
          this.decryptWallet([wallet]).then(() => {
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
    ...mapActions('main', ['setWeb3Instance', 'decryptWallet']),
    generateQr(code) {
      this.qrcode = code;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'FinneyModal.scss';
</style>
