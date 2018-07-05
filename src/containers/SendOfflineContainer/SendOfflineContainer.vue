<template>
  <div class="send-offline-container">
    <div class="content-title">
      <h2>{{ $t("reused.offline") }}</h2>
    </div>

    <div class="progress-status prevent-user-select">
      <div class="process1" v-on:click="processChange('process1')">
        <div class="prevent-pointer-events">
          <p class="title">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateInfo") }}</p>
        </div>
      </div>
      <div class="process2" v-on:click="processChange('process2')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.offline") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateTx") }}</p>
        </div>
      </div>
      <div class="process3" v-on:click="processChange('process3')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.sendPubTx") }}</p>
        </div>
      </div>
    </div>

    <generate-info v-if="currentProcess === 'process1'"></generate-info>
    <generate-tx v-if="currentProcess === 'process2'"></generate-tx>
    <send-tx v-if="currentProcess === 'process3'"></send-tx>

  </div>
</template>

<script>
import GenerateInfo from './components/GenerateInfo'
import GenerateTx from './components/GenerateTx'
import SendTx from './components/SendTx'

export default {
  components: {
    'generate-info': GenerateInfo,
    'generate-tx': GenerateTx,
    'send-tx': SendTx
  },
  data () {
    return {
    }
  },
  methods: {
    processChange (process) {
      this.$store.state.pageStates.sendOffline.processLocation = process
    }
  },
  mounted () {
    var activeProcess = this.$store.state.pageStates.sendOffline.processLocation
    document.querySelector('.' + activeProcess).classList.add('active')
  },
  computed: {
    currentProcess () {
      return this.$store.state.pageStates.sendOffline.processLocation
    }
  },
  watch: {
    currentProcess (value) {
      document.querySelectorAll('.progress-status > div').forEach(function (el) {
        el.classList.remove('active')
      })

      document.querySelector('.' + this.currentProcess).classList.add('active')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendOfflineContainer.scss";
</style>
