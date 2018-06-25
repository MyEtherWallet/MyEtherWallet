<template>
  <div class="create-wallet-by-json-file">
    <success-modal linkTo="/interface" message="You have created a wallet successfully" linkMessage="Access My Wallet"></success-modal>
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
          <b-tabs>
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>
                {{ $t('byJsonFile.saveKeystore')}}
                <span class="tooltip-icon">
                  <b-btn v-b-tooltip.hover :title="$t('reused.toolTip1')">?</b-btn>
                </span>
              </h3>
              <div class="contents">
                <by-json-block v-for="content in contents" :img="content.img" :title="content.title"
                               :desc="content.desc" :key="content.title"></by-json-block>
              </div>
              <div class="user-input">
                <a :href="walletJson" :class="[{disable: !downloadable} ,'next-button', 'large-round-button-green-filled']"
                   :download="name">
                  <span v-if="downloadable"> {{ $t('byJsonFile.downloadKeyFile')}} </span>
                  <div v-if="!downloadable">
                    <i class="fa fa-spinner fa-lg fa-spin"></i>
                  </div>
                </a>
              </div>
              <div class="footer-text">
                <p>
                  <router-link to="/">
                    <img class="icon" src="~@/assets/images/icons/printer.svg">
                    {{ $t('reused.printWallet') }}
                  </router-link>
                  <span class="tooltip-icon">
                    <b-btn v-b-tooltip.hover :title="$t('reused.toolTip1')">?</b-btn>
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
import noLose from '@/assets/images/icons/no-lose.svg'
import noShare from '@/assets/images/icons/no-share.svg'
import makeBackup from '@/assets/images/icons/make-a-backup.svg'
import Worker from '@/workers/wallet.worker.js'
import Wallet from 'ethereumjs-wallet'

export default {
  props: ['password'],
  data () {
    const self = this
    return {
      contents: [
        {
          title: self.$t('byJsonFile.dontLoseTitle'),
          desc: self.$t('byJsonFile.dontLoseDesc'),
          img: noLose
        },
        {
          title: self.$t('byJsonFile.dontShareTitle'),
          desc: self.$t('byJsonFile.dontShareDesc'),
          img: noShare
        },
        {
          title: self.$t('byJsonFile.makeBackupTitle'),
          desc: self.$t('byJsonFile.makeBackupDesc'),
          img: makeBackup
        }
      ],
      downloadable: false,
      walletJson: '',
      name: ''
    }
  },
  mounted: function () {
    const self = this
    const worker = new Worker()
    // console.log(this)
    worker.postMessage({type: 'createWallet', data: [self.password]})
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
    downloadable: function () {
      let self = this
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
