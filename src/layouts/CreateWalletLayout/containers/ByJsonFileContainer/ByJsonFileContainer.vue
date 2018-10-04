<template>
  <div class="create-wallet-by-json-file">
    <success-modal
      message="You have created a wallet successfully"
      link-to="/access-my-wallet"
      link-message="Access My Wallet"/>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
          <b-tabs>
            <div class="progress-bar"/>
            <b-tab
              title="By JSON File"
              active>

              <div class="title-block">
                <div class="title-popover">
                  <h3>
                    {{ $t('createWallet.byJsonFileSaveKeystore') }}
                  </h3>
                  <popover :popcontent="$t('popover.whatIsMessageContent')"/>
                </div>
              </div>

              <div class="contents">
                <by-json-block
                  v-for="content in contents"
                  :img="content.img"
                  :title="content.title"
                  :desc="content.desc"
                  :key="content.title"/>
              </div>

              <div class="user-input-container">
                <div class="user-input">
                  <div class="user-button">
                    <a
                      :href="walletJson"
                      :class="[{disable: !downloadable} ,'next-button', 'large-round-button-green-filled']"
                      :download="name"
                      @click="downloadDone()">
                      <span v-if="downloadable"> {{ $t('createWallet.byJsonFileDownloadKeyFile') }} </span>
                      <div v-if="!downloadable">
                        <i class="fa fa-spinner fa-lg fa-spin"/>
                      </div>
                    </a>
                  </div>
                  <div class="printer-icon">
                    <router-link to="/">
                      <img
                        class="icon"
                        src="~@/assets/images/icons/printer.svg">
                    </router-link>
                  </div>
                </div>
              </div>

            </b-tab>
          </b-tabs>
        </div>
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
import Worker from 'worker-loader!@/workers/wallet.worker.js';

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
  mounted() {
    const worker = new Worker();
    worker.postMessage({ type: 'createWallet', data: [this.password] });
    worker.onmessage = e => {
      const createBlob = (mime, str) => {
        const string = typeof str === 'object' ? JSON.stringify(str) : str;
        if (string === null) return '';
        const blob = new Blob([string], {
          type: mime
        });
        this.downloadable = true;
        return window.URL.createObjectURL(blob);
      };
      this.walletJson = createBlob('mime', e.data.walletJson);
      this.name = e.data.name.toString();
    };
    worker.onerror = function() {
      // eslint-disable-next-line no-console
      console.error('onerror received from worker'); // replace with debugger
    };
  },
  methods: {
    downloadDone() {
      this.$children[0].$refs.success.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ByJsonFileContainer.scss';
</style>
