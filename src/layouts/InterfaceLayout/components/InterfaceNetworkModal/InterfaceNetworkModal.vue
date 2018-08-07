<template>
  <div class="modal-container">
    <b-modal ref="network" hide-footer class="bootstrap-modal network nopadding max-height-1" title="Network">
      <div class="content-block">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('common.advanced') }}</h4>
          <div class="margin-left-auto add-custom-network">
            <p>{{ $t('interface.addCustomNode') }}</p>
            <div class="sliding-switch-white">
              <label class="switch">
                <input v-on:click="addCustomNetworkToggle" type="checkbox" ref="addCustomToggle" />
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="network-list" ref="networkList">
        <div class="content-block" v-for="(key, index) in Object.keys($store.state.Networks)" :key="key + index">
          <h4 :class="key === 'ETH' ? 'dot-green' : key === 'ETC' ? 'dot-bluegreen' : key === 'ROP' ? 'dot-blue' : key === 'EXP' ? 'dot-orange' : key === 'EXP' ? 'dot-green': ''">{{ key }}</h4>
          <div class="grid-3">
            <p class="switch-network" v-for="net in $store.state.Networks[key]" :key="net.service" @click="switchNetwork(net)" :class="net.service === $store.state.network.service && net.type.name === $store.state.network.type.name ? 'current-network': ''">{{net.service}}</p>
          </div>
        </div>
        <div class="content-block" v-if="customNetworks.length > 0">
          <h4>Custom Networks</h4>
          <div class="grid-3" v-for="(net, idx) in customNetworks" :key="net.service + '('+ net.type.name + ')' + idx">
            <div class="switch-network custom-network-item" :class="net.service === $store.state.network.service && net.type.name === $store.state.network.type.name ? 'current-network': ''">
              <p @click="switchNetwork(net)">{{net.service}} {{ '('+ net.type.name + ')' }}</p>
              <i class="fa fa-times-circle" @click.prevent="removeNetwork(net, idx)"></i>
            </div>
          </div>
        </div>
      </div>
      <form class="network-add hidden" ref="networkAdd">
        <div class="content-block">
          <div class="input-block-container">
            <input class="custom-input-text-1" type="text" name="" v-model="name" placeholder="ETH Node Name" autocomplete="off" />
            <select class="custom-select-1" v-model="selectedNetwork">
              <option v-for="network in networks" :value="network" :key="network.name + network.name_long">{{ network.name | capitalize }} - {{ network.name_long | capitalize }}</option>
            </select>
            <input class="custom-input-text-1" type="text" name="" v-model="url" placeholder="URL" autocomplete="off" />
            <input class="custom-input-text-1" type="text" name="" v-model="port" placeholder="Port" autocomplete="off" />
            <input class="custom-input-text-1" type="number" name="" v-model="chainID" placeholder="Chain ID" autocomplete="off" v-show="selectedNetwork.name === 'Custom'"/>
          </div>
        </div>

        <div class="content-block">
          <div class="flex-container">
            <h4 class="modal-title">{{ $t('interface.httpBasicAccess') }}</h4>
            <div class="margin-left-auto add-custom-network">
              <div class="sliding-switch-white">
                <label class="switch">
                  <input v-on:click="expendAuth" type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="auth-form-container hidden" ref="authForm">
            <input class="custom-input-text-1" type="text" name="" v-model="username" placeholder="User Name" autocomplete="off" />
            <input class="custom-input-text-1" type="password" name="" v-model="password" placeholder="Password" autocomplete="off" />
          </div>
        </div>

        <div class="content-block">
          <div class="save-button-container">
            <button class="save-button large-round-button-green-filled clickable" @click.prevent="saveCustomNetwork">
              {{ $t('interface.save') }}
            </button>
            <interface-bottom-text link="/" :linkText="$t('interface.learnMore')" :question="$t('interface.dontKnow')"></interface-bottom-text>
          </div>
        </div>

      </form>
    </b-modal>
  </div>
</template>

<script>
import store from 'store'

import InterfaceBottomText from '@/components/InterfaceBottomText'

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  data () {
    return {
      selectedNetwork: {name: 'ETH', name_long: 'Ethereum'},
      networks: [
        {name: 'ETH', name_long: 'Ethereum'},
        {name: 'ETC', name_long: 'Ethereum Classic'},
        {name: 'ROP', name_long: 'Ropsten'},
        {name: 'KOV', name_long: 'Kovan'},
        {name: 'RIN', name_long: 'Rinkeby'},
        {name: 'CUS', name_long: 'Custom'}
      ],
      chainID: '',
      port: '',
      name: '',
      url: '',
      username: '',
      password: '',
      customNetworks: []
    }
  },
  mounted () {
    if (store.get('customNetworks') !== undefined) {
      this.customNetworks = store.get('customNetworks')
    }
  },
  methods: {
    networkModalOpen () {
      this.$children[0].$refs.network.show()
    },
    removeNetwork (net, idx) {
      this.customNetworks.splice(idx, 1)
      if (net.type.name === this.$store.state.network.type.name) {
        if (this.customNetworks.length > 0) {
          this.switchNetwork(this.customNetworks[0])
        } else {
          this.switchNetwork(this.$store.state.Networks.ETH[0])
        }
      }
      store.set('customNetworks', this.customNetworks)
    },
    addCustomNetworkToggle () {
      this.$refs.network.$el.classList.toggle('max-height-1')
      this.$refs.networkList.classList.toggle('hidden')
      this.$refs.networkAdd.classList.toggle('hidden')
    },
    resetCompState () {
      this.selectedNetwork = {name: 'ETH', name_long: 'Ethereum'}
      this.chainID = ''
      this.port = ''
      this.name = ''
      this.url = ''
      this.username = ''
      this.password = ''
    },
    saveCustomNetwork () {
      let explorer = ''
      switch (this.selectedNetwork.name) {
        case 'ETH':
          explorer = 'https://etherscan.io/'
          break
        case 'ETC':
          explorer = 'https://gastracker.io/'
          break
        case 'ROP':
          explorer = 'https://ropsten.etherscan.io/'
          break
        case 'KOV':
          explorer = 'https://kovan.etherscan.io/'
          break
        case 'RIN':
          explorer = 'https://rinkeby.etherscan.io/'
          break
        default:
          explorer = 'https://etherscan.io/'
      }

      const customNetwork = {
        auth: !!(this.password !== '' && this.username !== ''),
        password: this.password,
        port: this.port,
        service: this.name,
        type: {
          blockExplorerAddr: `${explorer}address/[[txHash]]`,
          blockExplorerTX: `${explorer}tx/[[txHash]]`,
          chainID: this.chainID,
          contracts: [],
          homePage: '',
          name: this.selectedNetwork.name,
          name_long: this.selectedNetwork.name_long,
          tokens: []
        },
        url: this.port === '' ? this.url : `${this.url}:${this.port}`,
        username: this.username
      }

      this.customNetworks.push(customNetwork)
      this.resetCompState()
      this.$refs.addCustomToggle.click()
      store.set('customNetworks', this.customNetworks)
    },
    expendAuth () {
      this.$refs.authForm.classList.toggle('hidden')
    },
    switchNetwork (network) {
      this.$store.dispatch('switchNetwork', network)
    }
  },
  watch: {
    selectedNetwork (newVal) {
      switch (newVal.name) {
        case 'ETH':
          this.chainID = 1
          break
        case 'ETC':
          this.chainID = 61
          break
        case 'ROP':
          this.chainID = 3
          break
        case 'KOV':
          this.chainID = 42
          break
        case 'RIN':
          this.chainID = 4
          break
        default:
          this.chainID = this.chainID
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceNetworkModal.scss";
</style>
