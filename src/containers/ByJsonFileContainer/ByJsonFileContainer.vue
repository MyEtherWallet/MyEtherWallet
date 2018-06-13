<template>
  <div class="create-wallet-by-json-file">
    <div class="wrap">
      <div class="page-container">
        <div class="nav-tab-user-input-box">
          <b-tabs>
            <div class="progress-bar"></div>
            <b-tab title="By JSON File" active>
              <h3>
                {{ $t("byJsonFile.saveKeystore")}}
                <span class="tooltip-icon">
                  <b-btn v-b-tooltip.hover :title="$t('reused.toolTip1')">?</b-btn>
                </span>
              </h3>
              <div class="contents">
                <by-json-block v-for="content in contents" :img="content.img" :title="content.title" :desc="content.desc" :key="content.title"></by-json-block>
              </div>
              <div class="user-input">
                <div v-on:click="downloadKeystore" class="next-button large-round-button-green-filled">
                  {{ $t("byJsonFile.downloadKeyFile")}}
                </div>
              </div>
              <div class="footer-text">
                <p>
                  <router-link to="/">
                    <img class="icon" src="~@/assets/images/icons/printer.svg">
                    {{ $t("reused.printWallet") }}
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
      pw: self.password
    }
  },
  methods: {
    downloadKeystore: function () {
      var FileSaver = require('file-saver')
      var blob = new Blob(['Hello, world of Tokens!!!!!!!!'], {type: 'text/plain;charset=utf-8'})
      FileSaver.saveAs(blob, 'your-token-keystore.txt')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "ByJsonFileContainer.scss";
</style>
