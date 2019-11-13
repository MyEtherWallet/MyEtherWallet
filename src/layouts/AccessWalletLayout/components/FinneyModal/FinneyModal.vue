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
        <p>
          {{ $t('accessWallet.finney.scan-qr') }}
          <b>{{ $t('accessWallet.finney.finney-wallet') }}</b>
          {{ $t('accessWallet.finney.app-on') }}
          <b>{{ $t('accessWallet.finney.finney-bc') }}</b>
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
              {{ $t('accessWallet.finney.get-your') }}
            </p>
            <h3>
              {{ $t('accessWallet.finney.finney') }}
            </h3>
            <p>
              {{ $t('accessWallet.finney.now') }}
            </p>
          </a>
        </div>
      </div>
    </div>
    <div v-if="false" class="finney-mobile">
      {{ $t('accessWallet.finney.mobile') }}
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
