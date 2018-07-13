<template>
  <div class="modal-container">
    <b-modal ref="network" hide-footer class="bootstrap-modal network nopadding max-height-1" title="Network">
      <div class="content-block">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('reused.advanced') }}</h4>
          <div class="margin-left-auto add-custom-network">
            <p>{{ $t('interface.addCustomNode') }}</p>
            <div class="sliding-switch-white">
              <label class="switch">
                <input v-on:click="addCustomNetworkToggle" type="checkbox">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="network-list" ref="networkList">
        <div class="content-block" v-for="(key, index) in Object.keys($store.state.Networks)" :key="key + index">
          <h4 :class="key === 'ETH' ? 'dot-green' : key === 'ETC' ? 'dot-bluegreen' : key === 'Ropsten' ? 'dot-blue' : key === 'EXP' ? 'dot-orange' : key === 'EXP' ? 'dot-green': ''">{{ key }}</h4>
          <div class="grid-3">
            <p class="switch-network" v-for="net in $store.state.Networks[key]" :key="net.service" @click="switchNetwork(net)" :class="net.service === $store.state.network.service && net.type.name === $store.state.network.type.name ? 'current-network': ''">{{net.service}}</p>
          </div>
        </div>
      </div>
      <div class="network-add hidden" ref="networkAdd">
        <div class="content-block">
          <div class="input-block-container">
            <input class="custom-input-text-1" type="text" name="" value="" placeholder="ETH Node Name">
            <select class="custom-select-1">
              <option value="network">Network</option>
              <option value="node">Node</option>
            </select>
            <input class="custom-input-text-1" type="text" name="" value="" placeholder="URL">
            <input class="custom-input-text-1" type="text" name="" value="" placeholder="Port">
          </div>
        </div>

        <div class="content-block">
          <div class="flex-container">
            <h4 class="modal-title">{{ $t('interface.httpBasicAccess') }}</h4>
            <div class="margin-left-auto add-custom-network">
              <div class="sliding-switch-white">
                <label class="switch">
                  <input v-on:click="expendAuth" type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="auth-form-container hidden" ref="authForm">
            <input class="custom-input-text-1" type="text" name="" value="" placeholder="User Name">
            <input class="custom-input-text-1" type="text" name="" value="" placeholder="Password">
          </div>
        </div>

        <div class="content-block">
          <div class="save-button-container">
            <div class="save-button large-round-button-green-filled clickable">
              {{ $t('interface.save') }}
            </div>
            <p>{{ $t('interface.dontKnow') }} <a href="/">{{ $t('interface.learnMore') }}</a></p>
          </div>
        </div>

      </div>
    </b-modal>
  </div>
</template>

<script>
import web3 from 'web3'

export default {
  data () {
    return {
    }
  },
  methods: {
    networkModalOpen () {
      this.$children[0].$refs.network.show()
    },
    addCustomNetworkToggle () {
      this.$refs.network.$el.classList.toggle('max-height-1')
      this.$refs.networkList.classList.toggle('hidden')
      this.$refs.networkAdd.classList.toggle('hidden')
    },
    expendAuth () {
      this.$refs.authForm.classList.toggle('hidden')
    },
    switchNetwork (network) {
      this.$store.dispatch('switchNetwork', network)
      if (window.web3) {
        this.$store.dispatch('setWeb3Instance', window.web3)
      } else {
        this.$store.dispatch('setWeb3Instance', web3)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceNetworkModal.scss";
</style>
