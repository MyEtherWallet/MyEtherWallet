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
                <input v-on:click="addCustomNetworkToggle" type="checkbox" />
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
            <p class="switch-network" v-for="net in $store.state.Networks[key]" :key="net.service" @click="switchNetwork(net, false)" :class="net.service === $store.state.network.service && net.type.name === $store.state.network.type.name ? 'current-network': ''">{{net.service}}</p>
          </div>
        </div>
        <div class="content-block" v-if="customNetworks.length > 0">
          <h4>Custom Networks</h4>
          <div class="grid-3">
            <p class="switch-network" v-for="net in customNetworks" :key="net.service" @click="switchNetwork(net, true)" :class="net.service === $store.state.network.service && net.type.name === $store.state.network.type.name ? 'current-network': ''">{{net.service}}</p>
          </div>
        </div>
      </div>
      <div class="network-add hidden" ref="networkAdd">
        <div class="content-block">
          <div class="input-block-container">
            <input class="custom-input-text-1" type="text" name="" v-model="name" placeholder="ETH Node Name" autocomplete="off" />
            <select class="custom-select-1" v-model="selectedNetwork">
              <option v-for="network in networks" :value="network">{{ network | capitalize }}</option>
            </select>
            <input class="custom-input-text-1" type="text" name="" v-model="url" placeholder="URL" autocomplete="off" />
            <input class="custom-input-text-1" type="text" name="" v-model="port" placeholder="Port" autocomplete="off" />
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
import store from 'store'
import web3 from 'web3'

export default {
  data () {
    return {
      selectedNetwork: 'ETH',
      networks: ['ETH', 'ETC', 'Ropsten', 'Kovan', 'Rinkeby', 'Custom'],
      chainID: 0,
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
      this.customNetwork = store.get('customNetworks')
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
    switchNetwork (network, custom) {
      if (custom) {
        this.$store.dispatch('switchNetwork', network)
      } else {
        let explorer = ''
        switch (this.selectedNetwork) {
          case 'ETH':
            explorer = 'https://etherscan.io/'
            break
          case 'ETC':
            explorer = 'https://gastracker.io/'
            break
          case 'Ropsten':
            explorer = 'https://ropsten.etherscan.io/'
            break
          case 'Kovan':
            explorer = 'https://kovan.etherscan.io/'
            break
          case 'Rinkeby':
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
            name: this.name,
            name_long: this.name,
            tokens: []
          },
          url: this.url,
          username: this.username
        }

        this.$store.dispatch('switchNetwork', customNetwork)
        this.customNetworks.push(customNetwork)
        store.set('customNetworks', this.customNetworks)
      }
      if (window.web3) {
        this.$store.dispatch('setWeb3Instance', window.web3)
      } else {
        this.$store.dispatch('setWeb3Instance', web3)
      }
    }
  },
  watch: {
    selectedNetwork (newVal) {
      switch (newVal) {
        case 'ETH':
          this.chainID = 1
          break
        case 'ETC':
          this.chainID = 61
          break
        case 'Ropsten':
          this.chainID = 3
          break
        case 'Kovan':
          this.chainID = 42
          break
        case 'Rinkeby':
          this.chainID = 4
          break
        default:
          this.chainID = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceNetworkModal.scss";
</style>
