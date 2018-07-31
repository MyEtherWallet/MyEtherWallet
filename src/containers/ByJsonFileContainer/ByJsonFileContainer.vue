<template>
  <div class="create-wallet-by-json-file">
    <success-modal message="You have created a wallet successfully" linkTo="/interface" linkMessage="Access My Wallet"></success-modal>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
          <b-tabs>
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>
                {{ $t('createWallet.byJsonFileSaveKeystore')}}
                <span class="tooltip-icon">
                  <b-btn v-b-tooltip.hover :title="$t('common.toolTip1')">?</b-btn>
                </span>
              </h3>
              <div class="contents">
                <by-json-block v-for="content in contents" :img="content.img" :title="content.title"
                               :desc="content.desc" :key="content.title"></by-json-block>
              </div>
              <div class="user-input">
                <a :href="walletJson" :class="[{disable: !downloadable} ,'next-button', 'large-round-button-green-filled']"
                   :download="name">
                  <span v-if="downloadable"> {{ $t('createWallet.byJsonFileDownloadKeyFile')}} </span>
                  <div v-if="!downloadable">
                    <i class="fa fa-spinner fa-lg fa-spin"></i>
                  </div>
                </a>
              </div>
              <div class="footer-text">
                <p>
                  <router-link to="/">
                    <img class="icon" src="~@/assets/images/icons/printer.svg">
                    {{ $t('common.printWallet') }}
                  </router-link>
                  <span class="tooltip-icon">
                    <b-btn v-b-tooltip.hover :title="$t('common.toolTip1')">?</b-btn>
                  </span>
                </p>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuccessModal from '@/components/SuccessModal'
import ByJsonBlock from './components/ByJsonBlock'

import noLose from '@/assets/images/icons/no-lose.svg'
import noShare from '@/assets/images/icons/no-share.svg'
import makeBackup from '@/assets/images/icons/make-a-backup.svg'
import Worker from '@/workers/wallet.worker.js'
import Wallet from 'ethereumjs-wallet'

export default {
  props: ['password'],
  components: {
    'by-json-block': ByJsonBlock,
    'success-modal': SuccessModal
  },
  data () {
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
    }
  },
  mounted () {
    const worker = new Worker()
    const self = this
    worker.postMessage({type: 'createWallet', data: [this.password]})
    worker.onmessage = function (e) {
      // eslint-disable-next-line no-useless-escape
      self.walletJson = createBlob('mime', e.data.walletJson)
      self.name = e.data.name.toString()
      self.$store.dispatch('decryptWallet', Wallet.fromV3(e.data.walletJson, self.password))

      function createBlob (mime, str) {
        const string = (typeof str === 'object') ? JSON.stringify(str) : str
        if (string === null) return ''
        var blob = new Blob([string], {
          type: mime
        })
        self.downloadable = true
        return window.URL.createObjectURL(blob)
      }
    }
    worker.onerror = function (e) {
      console.log('onerror received from worker')
    }
  },
  watch: {
    downloadable () {
      const self = this
      setTimeout(function () {
        self.$children[0].$refs.success.show()
      }, 15000)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "ByJsonFileContainer.scss";
</style>
