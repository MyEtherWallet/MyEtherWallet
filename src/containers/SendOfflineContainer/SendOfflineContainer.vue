<template>
  <div class="send-offline-container">
    <div class="content-title">
      <h2>{{ $t("reused.offline") }}</h2>
    </div>

    <div class="progress-status prevent-user-select">
      <div ref="genInfo" class="genInfo" v-on:click="processChange('genInfo')">
        <div class="prevent-pointer-events">
          <p class="title">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateInfo") }}</p>
        </div>
      </div>
      <div ref="genTx" class="genTx" v-on:click="processChange('genTx')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.offline") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateTx") }}</p>
        </div>
      </div>
      <div ref="sendPubTx" class="sendPubTx" v-on:click="processChange('sendPubTx')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.sendPubTx") }}</p>
        </div>
      </div>
    </div>

    <generate-info v-if="currentProcess === 'genInfo'"></generate-info>
    <generate-tx v-if="currentProcess === 'genTx'"></generate-tx>
    <send-tx v-if="currentProcess === 'sendPubTx'"></send-tx>

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
    return {}
  },
  methods: {
    processChange (process) {
      this.$store.dispatch('updatePageState', ['interface', 'sendOffline', process])
    }
  },
  mounted () {
    var activeProcess = this.$store.state.pageStates.interface.sendOffline
    this.$refs[activeProcess].classList.add('active')
  },
  computed: {
    currentProcess () {
      return this.$store.state.pageStates.interface.sendOffline
    }
  },
  watch: {
    currentProcess (value) {
      const self = this
      Object.keys(this.$refs).forEach(function (item) {
        self.$refs[item].classList.remove('active')
      })
      this.$refs[this.currentProcess].classList.add('active')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendOfflineContainer.scss";
</style>
