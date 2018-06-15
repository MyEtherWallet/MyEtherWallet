<template>
  <div class="create-wallet-by-json-file">
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
                <a :href="walletJson" class="next-button large-round-button-green-filled"
                   :download="name">
                  {{ $t('byJsonFile.downloadKeyFile')}}
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
// import { Wallet } from '@/helpers'

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
      walletJson: {},
      name: ''
    }
  },
  mounted: function () {
    const self = this
    console.log('mounted') // todo remove dev item
    const worker = new Worker('static/js/worker.js')
    worker.postMessage({type: 'createWallet', data: [self.password]})
    worker.onmessage = function (e) {
      console.log(e) // todo remove dev item
      // eslint-disable-next-line no-useless-escape
      self.walletJson = createBlob('text\/plain', e.data.walletJson)
      self.name = e.data.name
      // wasn't passing the value back correctly
      function createBlob (mime, str) {
        console.log(str) // todo remove dev item
        const string = (typeof str === 'object') ? JSON.stringify(str) : str
        if (string === null) return ''
        var blob = new Blob([string], {
          type: mime
        })
        return window.URL.createObjectURL(blob)
      }
    }
    worker.onerror = function (e) {
      console.log(e) // todo remove dev item
      console.log('onerror received from worker')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "ByJsonFileContainer.scss";
</style>
