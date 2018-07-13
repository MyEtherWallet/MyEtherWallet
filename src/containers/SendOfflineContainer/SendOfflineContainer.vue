<template>
  <div class="send-offline-container">
    <div class="content-title">
      <h2>{{ $t("reused.offline") }}</h2>
    </div>

    <div class="progress-status prevent-user-select">
      <div :class="[ this.$store.state.pageStates.interface.sendOffline === 'genInfo' ? 'active' : '' ,'genInfo']" v-on:click="processChange('genInfo')">
        <div class="prevent-pointer-events">
          <p class="title">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateInfo") }}</p>
        </div>
      </div>
      <div :class="[ this.$store.state.pageStates.interface.sendOffline === 'genTx' ? 'active' : '' ,'genTx']" v-on:click="processChange('genTx')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.offline") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.generateTx") }}</p>
        </div>
      </div>
      <div :class="[ this.$store.state.pageStates.interface.sendOffline === 'sendPubTx' ? 'active' : '' ,'sendPubTx']" v-on:click="processChange('sendPubTx')">
        <div class="prevent-pointer-events">
          <p class="title prevent-pointer-events">{{ $t("interface.online") }}</p>
          <p class="description prevent-pointer-events">{{ $t("interface.sendPubTx") }}</p>
        </div>
      </div>
    </div>

    <generate-info v-if="this.$store.state.pageStates.interface.sendOffline === 'genInfo'"></generate-info>
    <generate-tx v-if="this.$store.state.pageStates.interface.sendOffline === 'genTx'"></generate-tx>
    <send-tx v-if="this.$store.state.pageStates.interface.sendOffline === 'sendPubTx'"></send-tx>

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
  }
}
</script>

<style lang="scss" scoped>
  @import "SendOfflineContainer.scss";
</style>
