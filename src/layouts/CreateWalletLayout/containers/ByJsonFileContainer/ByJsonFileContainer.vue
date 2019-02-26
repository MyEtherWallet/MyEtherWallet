<template>
  <div class="create-wallet-by-json-file">
    <success-modal
      ref="successModal"
      message="You have created a wallet successfully"
      link-to="/access-my-wallet"
      link-message="Access My Wallet"
    />
    <div class="wrap">
      <div class="nav-tab-user-input-box">
        <b-tabs>
          <div class="progress-bar" />
          <b-tab :title="$t('createWallet.byJsonFile')" active>
            <div class="title-block">
              <div class="title-popover">
                <h3>{{ $t('createWallet.byJsonFileSaveKeystore') }}</h3>
              </div>
            </div>
            <div class="contents">
              <by-json-block
                v-for="content in contents"
                :img="content.img"
                :title="content.title"
                :desc="content.desc"
                :key="content.title"
              />
            </div>
            <div class="user-input-container">
              <div class="user-input">
                <div class="user-button">
                  <a
                    :href="walletJson"
                    :class="[
                      { disable: !downloadable },
                      'next-button',
                      'large-round-button-green-filled',
                      'nopadding'
                    ]"
                    :download="name"
                    @click="downloadDone()"
                  >
                    <span v-if="downloadable">
                      {{ $t('createWallet.byJsonFileDownloadKeyFile') }}
                    </span>
                    <div v-if="!downloadable">
                      <i class="fa fa-spinner fa-lg fa-spin" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal/SuccessModal.vue';
import ByJsonBlock from '../../components/ByJsonBlock';

import noLose from '@/assets/images/icons/no-lose.svg';
import noShare from '@/assets/images/icons/no-share.svg';
import makeBackup from '@/assets/images/icons/make-a-backup.svg';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Toast, Wallet, Configs } from '@/helpers';
import { mapGetters } from 'vuex';

export default {
  components: {
    'by-json-block': ByJsonBlock,
    'success-modal': SuccessModal
  },
  props: {
    password: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      contents: [
        {
          title: this.$t('createWallet.byJsonFileDontLoseTitle'),
          desc: this.$t('createWallet.byJsonFileDontLoseDesc'),
          img: noLose
        },
        {
          title: this.$t('createWallet.byJsonFileDontShareTitle'),
          desc: this.$t('createWallet.byJsonFileDontShareDesc'),
          img: noShare
        },
        {
          title: this.$t('createWallet.byJsonFileMakeBackupTitle'),
          desc: this.$t('createWallet.byJsonFileMakeBackupDesc'),
          img: makeBackup
        }
      ],
      downloadable: false,
      walletJson: '',
      name: ''
    };
  },
  computed: {
    ...mapGetters({
      online: 'online'
    })
  },
  mounted() {
    if (this.online && window.Worker) {
      const worker = new walletWorker();
      worker.postMessage({ type: 'createWallet', data: [this.password] });
      worker.onmessage = e => {
        this.walletJson = this.createBlob('mime', e.data.walletJson);
        this.downloadable = true;
        this.name = e.data.name.toString();
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
      };
    } else {
      const _wallet = this.createWallet(this.password);
      this.walletJson = this.createBlob('mime', _wallet.walletJson);
      this.downloadable = true;
      this.name = _wallet.name.toString();
    }
  },
  methods: {
    downloadDone() {
      this.$refs.successModal.$refs.success.show();
    },
    createWallet(password) {
      const createdWallet = {};
      const wallet = new Wallet.generate();
      createdWallet.walletJson = wallet.toV3(password, {
        kdf: Configs.wallet.kdf,
        n: Configs.wallet.n
      });
      createdWallet.name = wallet.getV3Filename();
      return createdWallet;
    },
    createBlob(mime, str) {
      const string = typeof str === 'object' ? JSON.stringify(str) : str;
      if (string === null) return '';
      const blob = new Blob([string], {
        type: mime
      });
      return window.URL.createObjectURL(blob);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ByJsonFileContainer-desktop.scss';
@import 'ByJsonFileContainer-tablet.scss';
@import 'ByJsonFileContainer-mobile.scss';
</style>
