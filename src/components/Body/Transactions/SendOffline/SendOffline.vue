<template>
  <div class="send-offline">

    <vue-header></vue-header>
    <div class="wrap">
      <div class="side-nav">
        <transactions-side-menu></transactions-side-menu>
      </div>
      <div class="contents">
        <div class="tx-contents">
          <div class="">
            <transaction-address />
          </div>
          <div class="">
            <transaction-balance />
          </div>
          <div class="">
            <transaction-network />
          </div>
          <div class="main-content">
            <div class="content-title">
              <h2>Send Offline</h2>
            </div>

            <div class="progress-status prevent-user-select">
              <div class="process1" v-on:click="processChange('process1')">
                <div class="prevent-pointer-events">
                  <p class="title">Online</p>
                  <p class="description prevent-pointer-events">Generate Information</p>
                </div>
              </div>
              <div class="process2" v-on:click="processChange('process2')">
                <div class="prevent-pointer-events">
                  <p class="title prevent-pointer-events">Offline</p>
                  <p class="description prevent-pointer-events">Generate Transaction</p>
                </div>
              </div>
              <div class="process3" v-on:click="processChange('process3')">
                <div class="prevent-pointer-events">
                  <p class="title prevent-pointer-events">Online</p>
                  <p class="description prevent-pointer-events">Send/Publish Transaction</p>
                </div>
              </div>
            </div>

            <send-offline-generate-info v-if="currentProcess === 'process1'"></send-offline-generate-info>
            <send-offline-generate-tx v-if="currentProcess === 'process2'"></send-offline-generate-tx>
            <send-offline-send-tx v-if="currentProcess === 'process3'"></send-offline-send-tx>

          </div>
          <div class="tokens">
            <transaction-tokens />
          </div>
        </div>
      </div>
    </div>
    <vue-footer></vue-footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    processChange: function (process) {
      this.$store.state.state.pageStates.sendOffline.processLocation = process
    }
  },
  mounted () {
    var activeProcess = this.$store.state.state.pageStates.sendOffline.processLocation
    document.querySelector('.' + activeProcess).classList.add('active')
  },
  computed: {
    currentProcess: function () {
      return this.$store.state.state.pageStates.sendOffline.processLocation
    }
  },
  watch: {
    currentProcess: function (value) {
      document.querySelectorAll('.progress-status > div').forEach(function (el) {
        el.classList.remove('active')
      })

      document.querySelector('.' + this.currentProcess).classList.add('active')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "SendOffline.scss";
</style>
